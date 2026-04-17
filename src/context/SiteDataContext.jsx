import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultOffers } from '../data/offers'
import { defaultTestimonials } from '../data/testimonials'
import { apiDelete, apiGet, apiPost, apiPut } from '../lib/api'

const SiteDataContext = createContext(null)
const TOKEN_KEY = 'hotel_morphee_auth_token'

export function SiteDataProvider({ children }) {
  const [rooms, setRooms] = useState([])
  const [spaces, setSpaces] = useState([])
  const [offers, setOffers] = useState(defaultOffers)
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [contacts] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(TOKEN_KEY, authToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [authToken])

  useEffect(() => {
    Promise.all([apiGet('/api/rooms'), apiGet('/api/spaces'), apiGet('/api/testimonials')])
      .then(([roomsData, spacesData, testimonialsData]) => {
        setRooms(roomsData.rooms || [])
        setSpaces(spacesData.spaces || [])
        setTestimonials(testimonialsData.testimonials || [])
      })
      .catch(() => {
        setRooms([])
        setSpaces([])
        setTestimonials(defaultTestimonials)
      })
  }, [])

  useEffect(() => {
    if (!authToken) {
      setUser(null)
      setReservations([])
      setPayments([])
      return
    }

    let active = true

    Promise.all([
      apiGet('/api/auth/me', authToken),
      apiGet('/api/me/reservations', authToken),
      apiGet('/api/me/payments', authToken),
    ])
      .then(([authData, reservationsData, paymentsData]) => {
        if (!active) return
        setUser(authData.user)
        setReservations(reservationsData.reservations || [])
        setPayments(paymentsData.payments || [])
      })
      .catch(() => {
        if (!active) return
        setAuthToken('')
        setUser(null)
        setReservations([])
        setPayments([])
      })

    return () => {
      active = false
    }
  }, [authToken])

  const value = useMemo(() => ({
    rooms,
    spaces,
    offers,
    testimonials,
    contacts,
    newsletters,
    reservations,
    payments,
    user,
    authToken,
    adminSession: user?.role === 'admin' ? { email: user.email, role: user.role } : null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    async refreshRooms() {
      const data = await apiGet('/api/rooms')
      setRooms(data.rooms || [])
      return data.rooms || []
    },
    async refreshSpaces() {
      const data = await apiGet('/api/spaces')
      setSpaces(data.spaces || [])
      return data.spaces || []
    },
    async refreshTestimonials() {
      const data = await apiGet('/api/testimonials')
      setTestimonials(data.testimonials || [])
      return data.testimonials || []
    },
    async refreshAccountData() {
      if (!authToken) return
      const [reservationsData, paymentsData] = await Promise.all([
        apiGet('/api/me/reservations', authToken),
        apiGet('/api/me/payments', authToken),
      ])
      setReservations(reservationsData.reservations || [])
      setPayments(paymentsData.payments || [])
    },
    async login(email, password) {
      setLoading(true)
      try {
        const data = await apiPost('/api/auth/login', { email, password })
        setAuthToken(data.token)
        setUser(data.user)
        return { ok: true, user: data.user }
      } catch (error) {
        return { ok: false, message: error.message }
      } finally {
        setLoading(false)
      }
    },
    async register(name, email, password) {
      setLoading(true)
      try {
        const data = await apiPost('/api/auth/register', { name, email, password })
        setAuthToken(data.token)
        setUser(data.user)
        return { ok: true, user: data.user }
      } catch (error) {
        return { ok: false, message: error.message }
      } finally {
        setLoading(false)
      }
    },
    logout() {
      setAuthToken('')
      setUser(null)
      setReservations([])
      setPayments([])
    },
    async addReservation(payload) {
      if (!authToken) throw new Error('Connexion requise pour réserver.')
      const data = await apiPost('/api/reservations/rooms', payload, authToken)
      setReservations((current) => [data.reservation, ...current])
      return data.reservation
    },
    async addSpaceReservation(payload) {
      if (!authToken) throw new Error('Connexion requise pour réserver une salle.')
      const data = await apiPost('/api/reservations/spaces', payload, authToken)
      setReservations((current) => [data.reservation, ...current])
      return data.reservation
    },
    async cancelReservation(id) {
      if (!authToken) throw new Error('Connexion requise.')
      const data = await apiPost(`/api/me/reservations/${id}/cancel`, {}, authToken)
      setReservations((current) => current.map((item) => (Number(item.id) === Number(id) ? data.reservation : item)))
      return data.reservation
    },
    async initiatePayment({ reservationId, provider, phone, amount }) {
      if (!authToken) throw new Error('Connexion requise pour payer.')
      const data = await apiPost('/api/payments/paygate/initiate', { reservationId, provider, phone, amount }, authToken)
      setPayments((current) => [data.payment, ...current])
      setReservations((current) => current.map((item) => (
        Number(item.id) === Number(reservationId)
          ? { ...item, paymentStatus: data.payment.status, paymentReference: data.payment.reference, amount: data.payment.amount, status: data.payment.status === 'completed' ? 'confirmed' : item.status }
          : item
      )))
      return data
    },
    addNewsletter(email) {
      const entry = { id: Date.now(), email, createdAt: new Date().toISOString() }
      setNewsletters((current) => [entry, ...current])
      return entry
    },
    async addRoom(payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPost('/api/admin/rooms', payload, authToken)
      setRooms((current) => [data.room, ...current])
      return data.room
    },
    async updateRoom(id, payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPut(`/api/admin/rooms/${id}`, payload, authToken)
      setRooms((current) => current.map((room) => (Number(room.id) === Number(id) ? data.room : room)))
      return data.room
    },
    async deleteRoom(id) {
      if (!authToken) throw new Error('Connexion admin requise.')
      await apiDelete(`/api/admin/rooms/${id}`, authToken)
      setRooms((current) => current.filter((room) => Number(room.id) !== Number(id)))
    },
    async addSpace(payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPost('/api/admin/spaces', payload, authToken)
      setSpaces((current) => [data.space, ...current])
      return data.space
    },
    async updateSpace(id, payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPut(`/api/admin/spaces/${id}`, payload, authToken)
      setSpaces((current) => current.map((space) => (Number(space.id) === Number(id) ? data.space : space)))
      return data.space
    },
    async deleteSpace(id) {
      if (!authToken) throw new Error('Connexion admin requise.')
      await apiDelete(`/api/admin/spaces/${id}`, authToken)
      setSpaces((current) => current.filter((space) => Number(space.id) !== Number(id)))
    },
    async addTestimonial(payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPost('/api/admin/testimonials', payload, authToken)
      setTestimonials((current) => [data.testimonial, ...current])
      return data.testimonial
    },
    async updateTestimonial(id, payload) {
      if (!authToken) throw new Error('Connexion admin requise.')
      const data = await apiPut(`/api/admin/testimonials/${id}`, payload, authToken)
      setTestimonials((current) => current.map((testimonial) => (Number(testimonial.id) === Number(id) ? data.testimonial : testimonial)))
      return data.testimonial
    },
    async deleteTestimonial(id) {
      if (!authToken) throw new Error('Connexion admin requise.')
      await apiDelete(`/api/admin/testimonials/${id}`, authToken)
      setTestimonials((current) => current.filter((testimonial) => Number(testimonial.id) !== Number(id)))
    },
    addOffer(payload) {
      const offer = { id: Date.now(), ...payload }
      setOffers((current) => [offer, ...current])
      return offer
    },
    deleteOffer(id) {
      setOffers((current) => current.filter((offer) => offer.id !== id))
    },
  }), [rooms, spaces, offers, testimonials, contacts, newsletters, reservations, payments, user, authToken, loading])

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)

  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }

  return context
}
