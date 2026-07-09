import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { ensureDb, nextId, readDb, withDb } from './lib/store.js'
import { createPayGatePayment } from './lib/paygate.js'
import { requireAuth, requireRole, sanitizeUser, signToken } from './lib/auth.js'

await ensureDb()

const app = express()
const PORT = Number(process.env.PORT || 4000)
const APP_URL = process.env.APP_URL || 'http://localhost:5173'

app.use(cors({ origin: APP_URL, credentials: false }))
app.use(express.json({ limit: '10mb' }))

app.get('/', async (_req, res) => {
  res.json({
    ok: true,
    service: 'hotel-le-morphee-api',
    message: 'API Hotel Le Morphee OK',
    docs: {
      health: '/api/health',
      rooms: '/api/rooms',
      spaces: '/api/spaces',
    },
  })
})

function cancelReservationInDraft(draft, reservationId, actor = 'client') {
  const reservation = draft.reservations.find((item) => Number(item.id) === Number(reservationId))

  if (!reservation) {
    return { error: 'Réservation introuvable.', status: 404 }
  }

  if (reservation.paymentStatus === 'completed') {
    return { error: 'Cette réservation a déjà été payée. Veuillez contacter l’hôtel pour une annulation manuelle.', status: 409 }
  }

  if (reservation.status === 'canceled') {
    return { reservation }
  }

  reservation.status = 'canceled'
  reservation.paymentStatus = reservation.paymentStatus === 'completed' ? 'completed' : 'canceled'
  reservation.canceledAt = new Date().toISOString()
  reservation.canceledBy = actor
  reservation.updatedAt = new Date().toISOString()

  return { reservation }
}

function getReservationAmount(reservation, db) {
  if (Number(reservation.amount || 0) > 0) {
    return Number(reservation.amount)
  }

  if (reservation.type === 'room') {
    const room = db.rooms.find((item) => Number(item.id) === Number(reservation.roomId))
    return Number(room?.price || 0)
  }

  return 0
}

function normalizePaymentStatus(value) {
  const status = String(value || '').trim().toLowerCase()

  if (['completed', 'success', 'successful', 'paid'].includes(status)) return 'completed'
  if (['failed', 'error', 'rejected'].includes(status)) return 'failed'
  if (['canceled', 'cancelled'].includes(status)) return 'canceled'
  if (['pending', 'processing', 'initiated'].includes(status)) return 'pending'
  return 'pending'
}

function applyPaymentStatusInDraft(draft, reference, status) {
  const payment = draft.payments.find((item) => item.reference === reference)
  if (!payment) return null

  payment.status = status
  payment.updatedAt = new Date().toISOString()

  const reservation = draft.reservations.find((item) => Number(item.id) === Number(payment.reservationId))
  if (reservation) {
    reservation.paymentStatus = status
    reservation.status = status === 'completed' ? 'confirmed' : reservation.status
    reservation.updatedAt = new Date().toISOString()
  }

  return payment
}

function buildRoomReservation(req, db) {
  const { roomId, checkIn, checkOut, guests = 1, note = '', paymentMethod = 'counter', phone = '', email = '', customerName = '' } = req.body || {}
  const room = db.rooms.find((item) => Number(item.id) === Number(roomId))

  if (!room) {
    return { error: 'Chambre introuvable.', status: 404 }
  }

  const user = db.users.find((item) => Number(item.id) === Number(req.auth.sub))
  const amount = Number(room.price || 0)

  return {
    reservation: {
      userId: Number(req.auth.sub),
      userEmail: email || user?.email || null,
      userName: customerName || user?.name || null,
      phone: phone || null,
      type: 'room',
      roomId: room.id,
      roomName: room.name?.fr || room.slug,
      spaceId: null,
      spaceName: null,
      reservationLabel: room.name?.fr || room.slug,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      eventDate: null,
      guests: Number(guests || 1),
      attendees: null,
      amount,
      note,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

function buildSpaceReservation(req, db) {
  const { spaceId, eventDate, attendees = 1, note = '', paymentMethod = 'counter', phone = '', email = '', customerName = '', amount = 0 } = req.body || {}
  const space = db.spaces.find((item) => Number(item.id) === Number(spaceId))

  if (!space) {
    return { error: 'Salle introuvable.', status: 404 }
  }

  const user = db.users.find((item) => Number(item.id) === Number(req.auth.sub))
  const parsedAmount = Number(amount || 0)

  return {
    reservation: {
      userId: Number(req.auth.sub),
      userEmail: email || user?.email || null,
      userName: customerName || user?.name || null,
      phone: phone || null,
      type: 'space',
      roomId: null,
      roomName: null,
      spaceId: space.id,
      spaceName: space.title?.fr || space.slug,
      reservationLabel: space.title?.fr || space.slug,
      checkIn: null,
      checkOut: null,
      eventDate: eventDate || null,
      guests: null,
      attendees: Number(attendees || 1),
      amount: parsedAmount > 0 ? parsedAmount : 0,
      note,
      paymentMethod,
      status: 'pending',
      paymentStatus: parsedAmount > 0 && (paymentMethod === 'flooz' || paymentMethod === 'tmoney') ? 'pending' : 'not_requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, service: 'hotel-le-morphee-api', mode: process.env.PAYMENT_MODE || 'mock', storage: 'sqlite' })
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Nom, email et mot de passe sont obligatoires.' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const db = await readDb()
  const existing = db.users.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (existing) {
    return res.status(409).json({ message: 'Un compte existe déjà avec cet email.' })
  }

  const user = await withDb((draft) => {
    const created = {
      id: nextId(draft.users),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      role: 'customer',
      createdAt: new Date().toISOString(),
    }

    draft.users.push(created)
    return created
  })

  const token = signToken(user)
  res.status(201).json({ token, user: sanitizeUser(user) })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' })
  }

  const db = await readDb()
  const user = db.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Identifiants invalides.' })
  }

  const token = signToken(user)
  res.json({ token, user: sanitizeUser(user) })
})

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const db = await readDb()
  const user = db.users.find((item) => Number(item.id) === Number(req.auth.sub))

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' })
  }

  res.json({ user: sanitizeUser(user) })
})

app.get('/api/rooms', async (_req, res) => {
  const db = await readDb()
  res.json({ rooms: db.rooms })
})

app.get('/api/spaces', async (_req, res) => {
  const db = await readDb()
  res.json({ spaces: db.spaces })
})

app.get('/api/testimonials', async (_req, res) => {
  const db = await readDb()
  res.json({ testimonials: db.testimonials })
})

app.post('/api/newsletters', async (req, res) => {
  const { email, consent = false } = req.body || {}

  if (!consent) {
    return res.status(400).json({ message: "Le consentement est requis pour l'inscription." })
  }

  if (!email?.trim()) {
    return res.status(400).json({ message: "L'email est obligatoire." })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const db = await readDb()
  const existing = db.newsletters.find((item) => item.email?.toLowerCase() === normalizedEmail)

  if (existing) {
    return res.json({ newsletter: existing, created: false })
  }

  const newsletter = await withDb((draft) => {
    const created = {
      id: nextId(draft.newsletters),
      email: normalizedEmail,
      consent: true,
      status: 'subscribed',
      source: 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.newsletters.unshift(created)
    return created
  })

  res.status(201).json({ newsletter, created: true })
})

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone = '', message, consent = false } = req.body || {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'Nom, email et message sont obligatoires.' })
  }

  if (!consent) {
    return res.status(400).json({ message: 'Le consentement est requis pour envoyer ce message.' })
  }

  const contact = await withDb((draft) => {
    const created = {
      id: nextId(draft.contacts),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      message: message.trim(),
      consent: true,
      status: 'new',
      source: 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.contacts.unshift(created)
    return created
  })

  res.status(201).json({ contact })
})

app.post('/api/admin/rooms', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = req.body || {}

  if (!payload.name?.fr?.trim() || !payload.image?.trim()) {
    return res.status(400).json({ message: 'Le nom français et l’image principale sont obligatoires.' })
  }

  const room = await withDb((draft) => {
    const created = {
      id: nextId(draft.rooms),
      slug: payload.slug || `room-${Date.now()}`,
      name: payload.name,
      price: Number(payload.price || 0),
      size: payload.size || '20 m2',
      capacity: Number(payload.capacity || 2),
      description: payload.description || { fr: '', en: '' },
      amenities: Array.isArray(payload.amenities) ? payload.amenities : [],
      image: payload.image,
      gallery: Array.isArray(payload.gallery) ? payload.gallery : [payload.image],
      featured: Boolean(payload.featured),
      highlights: payload.highlights || { fr: [], en: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.rooms.unshift(created)
    return created
  })

  res.status(201).json({ room })
})

app.put('/api/admin/rooms/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const roomId = Number(req.params.id)
  const payload = req.body || {}

  const room = await withDb((draft) => {
    const current = draft.rooms.find((item) => Number(item.id) === roomId)
    if (!current) return null

    Object.assign(current, payload, { updatedAt: new Date().toISOString() })
    return current
  })

  if (!room) {
    return res.status(404).json({ message: 'Chambre introuvable.' })
  }

  res.json({ room })
})

app.delete('/api/admin/rooms/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const roomId = Number(req.params.id)

  const deleted = await withDb((draft) => {
    const index = draft.rooms.findIndex((item) => Number(item.id) === roomId)
    if (index < 0) return null
    return draft.rooms.splice(index, 1)[0]
  })

  if (!deleted) {
    return res.status(404).json({ message: 'Chambre introuvable.' })
  }

  res.json({ ok: true })
})

app.post('/api/admin/spaces', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = req.body || {}

  if (!payload.title?.fr?.trim() || !payload.image?.trim()) {
    return res.status(400).json({ message: 'Le titre français et l’image principale sont obligatoires.' })
  }

  const space = await withDb((draft) => {
    const created = {
      id: nextId(draft.spaces),
      slug: payload.slug || `space-${Date.now()}`,
      title: payload.title,
      text: payload.text || { fr: '', en: '' },
      description: payload.description || { fr: '', en: '' },
      image: payload.image,
      gallery: Array.isArray(payload.gallery) ? payload.gallery : [payload.image],
      accent: payload.accent || 'from-[#f7d7de] to-[#7a2230]',
      highlights: payload.highlights || { fr: [], en: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.spaces.unshift(created)
    return created
  })

  res.status(201).json({ space })
})

app.put('/api/admin/spaces/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const spaceId = Number(req.params.id)
  const payload = req.body || {}

  const space = await withDb((draft) => {
    const current = draft.spaces.find((item) => Number(item.id) === spaceId)
    if (!current) return null

    Object.assign(current, payload, { updatedAt: new Date().toISOString() })
    return current
  })

  if (!space) {
    return res.status(404).json({ message: 'Salle introuvable.' })
  }

  res.json({ space })
})

app.delete('/api/admin/spaces/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const spaceId = Number(req.params.id)

  const deleted = await withDb((draft) => {
    const index = draft.spaces.findIndex((item) => Number(item.id) === spaceId)
    if (index < 0) return null
    return draft.spaces.splice(index, 1)[0]
  })

  if (!deleted) {
    return res.status(404).json({ message: 'Salle introuvable.' })
  }

  res.json({ ok: true })
})

app.post('/api/admin/testimonials', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = req.body || {}

  if (!payload.name?.trim() || !payload.text?.fr?.trim()) {
    return res.status(400).json({ message: 'Le nom et le texte français de l’avis sont obligatoires.' })
  }

  const testimonial = await withDb((draft) => {
    const created = {
      id: nextId(draft.testimonials),
      name: payload.name.trim(),
      role: payload.role || { fr: '', en: '' },
      text: payload.text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.testimonials.unshift(created)
    return created
  })

  res.status(201).json({ testimonial })
})

app.put('/api/admin/testimonials/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const testimonialId = Number(req.params.id)
  const payload = req.body || {}

  const testimonial = await withDb((draft) => {
    const current = draft.testimonials.find((item) => Number(item.id) === testimonialId)
    if (!current) return null

    Object.assign(current, payload, { updatedAt: new Date().toISOString() })
    return current
  })

  if (!testimonial) {
    return res.status(404).json({ message: 'Avis introuvable.' })
  }

  res.json({ testimonial })
})

app.delete('/api/admin/testimonials/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const testimonialId = Number(req.params.id)

  const deleted = await withDb((draft) => {
    const index = draft.testimonials.findIndex((item) => Number(item.id) === testimonialId)
    if (index < 0) return null
    return draft.testimonials.splice(index, 1)[0]
  })

  if (!deleted) {
    return res.status(404).json({ message: 'Avis introuvable.' })
  }

  res.json({ ok: true })
})

app.get('/api/me/reservations', requireAuth, async (req, res) => {
  const db = await readDb()
  const reservations = db.reservations.filter((item) => Number(item.userId) === Number(req.auth.sub))
  res.json({ reservations })
})

app.post('/api/me/reservations/:id/cancel', requireAuth, async (req, res) => {
  const reservationId = Number(req.params.id)
  const currentDb = await readDb()
  const ownedReservation = currentDb.reservations.find((item) => Number(item.id) === reservationId && Number(item.userId) === Number(req.auth.sub))

  if (!ownedReservation) {
    return res.status(404).json({ message: 'Réservation introuvable.' })
  }

  const result = await withDb((draft) => cancelReservationInDraft(draft, reservationId, 'client'))

  if (result?.error) {
    return res.status(result.status || 400).json({ message: result.error })
  }

  res.json({ reservation: result.reservation })
})

app.get('/api/me/payments', requireAuth, async (req, res) => {
  const db = await readDb()
  const payments = db.payments.filter((item) => Number(item.userId) === Number(req.auth.sub))
  res.json({ payments })
})

app.get('/api/me/payments/:reference', requireAuth, async (req, res) => {
  const reference = String(req.params.reference || '')
  const db = await readDb()
  const payment = db.payments.find((item) => item.reference === reference && Number(item.userId) === Number(req.auth.sub))

  if (!payment) {
    return res.status(404).json({ message: 'Paiement introuvable.' })
  }

  const reservation = db.reservations.find((item) => Number(item.id) === Number(payment.reservationId) && Number(item.userId) === Number(req.auth.sub))
  res.json({ payment, reservation: reservation || null })
})

app.get('/api/admin/reservations', requireAuth, requireRole('admin'), async (_req, res) => {
  const db = await readDb()
  res.json({ reservations: db.reservations })
})

app.post('/api/admin/reservations/:id/cancel', requireAuth, requireRole('admin'), async (req, res) => {
  const reservationId = Number(req.params.id)
  const result = await withDb((draft) => cancelReservationInDraft(draft, reservationId, 'admin'))

  if (result?.error) {
    return res.status(result.status || 400).json({ message: result.error })
  }

  res.json({ reservation: result.reservation })
})

app.get('/api/admin/payments', requireAuth, requireRole('admin'), async (_req, res) => {
  const db = await readDb()
  res.json({ payments: db.payments })
})

app.post('/api/admin/payments/:reference/simulate', requireAuth, requireRole('admin'), async (req, res) => {
  const reference = String(req.params.reference || '')
  const status = normalizePaymentStatus(req.body?.status || 'completed')

  if (!reference) {
    return res.status(400).json({ message: 'Référence de paiement manquante.' })
  }

  const updated = await withDb((draft) => applyPaymentStatusInDraft(draft, reference, status))

  if (!updated) {
    return res.status(404).json({ message: 'Paiement introuvable.' })
  }

  res.json({ payment: updated })
})

app.get('/api/admin/contacts', requireAuth, requireRole('admin'), async (_req, res) => {
  const db = await readDb()
  res.json({ contacts: db.contacts })
})

app.get('/api/admin/newsletters', requireAuth, requireRole('admin'), async (_req, res) => {
  const db = await readDb()
  res.json({ newsletters: db.newsletters })
})

app.post('/api/reservations', requireAuth, async (req, res) => {
  const db = await readDb()
  const built = buildRoomReservation(req, db)

  if (built.error) {
    return res.status(built.status || 400).json({ message: built.error })
  }

  const reservation = await withDb((draft) => {
    const created = {
      id: nextId(draft.reservations),
      ...built.reservation,
    }

    draft.reservations.unshift(created)
    return created
  })

  res.status(201).json({ reservation })
})

app.post('/api/reservations/rooms', requireAuth, async (req, res) => {
  const db = await readDb()
  const built = buildRoomReservation(req, db)

  if (built.error) {
    return res.status(built.status || 400).json({ message: built.error })
  }

  const reservation = await withDb((draft) => {
    const created = {
      id: nextId(draft.reservations),
      ...built.reservation,
    }

    draft.reservations.unshift(created)
    return created
  })

  res.status(201).json({ reservation })
})

app.post('/api/reservations/spaces', requireAuth, async (req, res) => {
  const db = await readDb()
  const built = buildSpaceReservation(req, db)

  if (built.error) {
    return res.status(built.status || 400).json({ message: built.error })
  }

  const reservation = await withDb((draft) => {
    const created = {
      id: nextId(draft.reservations),
      ...built.reservation,
    }

    draft.reservations.unshift(created)
    return created
  })

  res.status(201).json({ reservation })
})

app.post('/api/payments/paygate/initiate', requireAuth, async (req, res) => {
  const { reservationId, provider = 'flooz', phone, amount } = req.body || {}
  const db = await readDb()
  const reservation = db.reservations.find((item) => Number(item.id) === Number(reservationId) && Number(item.userId) === Number(req.auth.sub))

  if (!reservation) {
    return res.status(404).json({ message: 'Réservation introuvable.' })
  }

  if (reservation.status === 'canceled') {
    return res.status(409).json({ message: 'Cette réservation a été annulée.' })
  }

  const paymentAmount = Number(amount || 0) || getReservationAmount(reservation, db)

  if (paymentAmount <= 0) {
    return res.status(400).json({ message: 'Aucun montant payable n’est défini pour cette réservation.' })
  }

  const result = await createPayGatePayment({ amount: paymentAmount, phone, reservation, provider })

  if (!result.ok) {
    return res.status(503).json(result)
  }

  const payment = await withDb((draft) => {
    const created = {
      id: nextId(draft.payments),
      userId: Number(req.auth.sub),
      reservationId: reservation.id,
      provider,
      phone: phone || reservation.phone || null,
      amount: paymentAmount,
      currency: 'XOF',
      reference: result.reference,
      status: result.status,
      meta: result.meta || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    draft.payments.unshift(created)

    const reservationDraft = draft.reservations.find((item) => Number(item.id) === Number(reservation.id))
    if (reservationDraft) {
      reservationDraft.paymentStatus = created.status
      reservationDraft.paymentReference = created.reference
      reservationDraft.status = created.status === 'completed' ? 'confirmed' : reservationDraft.status
      reservationDraft.amount = paymentAmount
      reservationDraft.updatedAt = new Date().toISOString()
    }

    return created
  })

  res.status(201).json({ payment, checkoutUrl: result.checkoutUrl || null, mode: process.env.PAYMENT_MODE || 'mock' })
})

async function handlePayGateCallback(req, res) {
  const payload = req.method === 'GET' ? (req.query || {}) : (req.body || {})
  const reference = payload.reference || payload.payment_reference || payload.tx_reference || payload.identifier
  const status = normalizePaymentStatus(payload.status || payload.payment_status || 'completed')

  if (!reference) {
    return res.status(400).json({ message: 'Référence de paiement manquante.' })
  }

  const updated = await withDb((draft) => applyPaymentStatusInDraft(draft, reference, status))

  if (!updated) {
    return res.status(404).json({ message: 'Paiement introuvable.' })
  }

  res.json({ ok: true })
}

app.get('/api/payments/callback/paygate', handlePayGateCallback)
app.post('/api/payments/callback/paygate', handlePayGateCallback)

app.listen(PORT, () => {
  console.log(`Hotel Le Morphee API listening on http://localhost:${PORT}`)
})


