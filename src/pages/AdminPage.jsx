import { BedDouble, Bell, CalendarDays, CreditCard, Inbox, LayoutDashboard, MessageSquareQuote, Settings2, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminContentPanel from '../components/admin/AdminContentPanel'
import AdminInboxPanel from '../components/admin/AdminInboxPanel'
import AdminLoginCard from '../components/admin/AdminLoginCard'
import AdminNotificationsPanel from '../components/admin/AdminNotificationsPanel'
import AdminOverviewPanel from '../components/admin/AdminOverviewPanel'
import AdminOperationsPanel from '../components/admin/AdminOperationsPanel'
import AdminPaymentsPanel from '../components/admin/AdminPaymentsPanel'
import AdminRoomsPanel from '../components/admin/AdminRoomsPanel'
import AdminSettingsPanel from '../components/admin/AdminSettingsPanel'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminSpacesPanel from '../components/admin/AdminSpacesPanel'
import AdminTopbar from '../components/admin/AdminTopbar'
import { useSiteData } from '../context/SiteDataContext'
import { apiGet, apiPost } from '../lib/api'

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLocalized(fr, en) {
  return { fr: fr.trim(), en: (en || fr).trim() }
}

function splitList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

function uniqueList(items) {
  return Array.from(new Set(items.filter(Boolean)))
}

function getFormImages(form) {
  return uniqueList([form.image.trim(), ...splitList(form.gallery)])
}

function removeImageFromForm(current, imageToRemove) {
  const currentImage = current.image.trim()
  const remaining = getFormImages(current).filter((item) => item !== imageToRemove)
  const nextImage = currentImage === imageToRemove ? (remaining[0] || '') : currentImage
  const nextGallery = remaining.filter((item) => item !== nextImage)

  return {
    ...current,
    image: nextImage,
    gallery: nextGallery.join(', '),
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function formatRelativeDate(value) {
  if (!value) return 'A l instant'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'A l instant'

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function emptyRoomForm() {
  return {
    id: null,
    nameFr: '',
    nameEn: '',
    price: '',
    size: '',
    capacity: '2',
    image: '',
    gallery: '',
    descriptionFr: '',
    descriptionEn: '',
    amenitiesFr: '',
    amenitiesEn: '',
    highlightsFr: '',
    highlightsEn: '',
    featured: false,
  }
}

function emptySpaceForm() {
  return {
    id: null,
    titleFr: '',
    titleEn: '',
    textFr: '',
    textEn: '',
    descriptionFr: '',
    descriptionEn: '',
    image: '',
    gallery: '',
    highlightsFr: '',
    highlightsEn: '',
    accent: 'from-[#f7d7de] to-[#7a2230]',
  }
}

function emptyTestimonialForm() {
  return {
    id: null,
    name: '',
    roleFr: '',
    roleEn: '',
    textFr: '',
    textEn: '',
  }
}

function emptyPaymentSimulationForm() {
  return {
    reference: '',
    status: 'completed',
  }
}

const HOTEL_FACTS = {
  roomCount: 14,
  ventilatedRooms: 3,
  airConditionedRooms: 11,
  eventSpaceCount: 3,
}
const NOTIFICATION_READ_KEY = 'hotel_morphee_admin_notifications_read'

function AdminDashboard() {
  const navigate = useNavigate()
  const {
    user,
    authToken,
    logout,
    rooms,
    spaces,
    testimonials,
    addRoom,
    updateRoom,
    deleteRoom,
    addSpace,
    updateSpace,
    deleteSpace,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useSiteData()

  const [activeSection, setActiveSection] = useState('overview')
  const [roomForm, setRoomForm] = useState(emptyRoomForm())
  const [spaceForm, setSpaceForm] = useState(emptySpaceForm())
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm())
  const [paymentSimulationForm, setPaymentSimulationForm] = useState(emptyPaymentSimulationForm())
  const [adminReservations, setAdminReservations] = useState([])
  const [adminPayments, setAdminPayments] = useState([])
  const [adminContacts, setAdminContacts] = useState([])
  const [adminNewsletters, setAdminNewsletters] = useState([])
  const [flash, setFlash] = useState('')
  const [isUploadingRoomImages, setIsUploadingRoomImages] = useState(false)
  const [isUploadingSpaceImages, setIsUploadingSpaceImages] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_READ_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const roomFormImages = useMemo(() => getFormImages(roomForm), [roomForm])
  const spaceFormImages = useMemo(() => getFormImages(spaceForm), [spaceForm])

  const navItems = [
    { id: 'overview', label: 'Vue generale', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'rooms', label: 'Chambres', icon: BedDouble },
    { id: 'spaces', label: 'Salles', icon: Sparkles },
    { id: 'content', label: 'Temoignages', icon: MessageSquareQuote },
    { id: 'operations', label: 'Reservations', icon: CalendarDays },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'inbox', label: 'Messages', icon: Inbox },
    { id: 'settings', label: 'Pilotage', icon: Settings2 },
  ]

  const activeSectionLabel = navItems.find((item) => item.id === activeSection)?.label || 'Vue generale'

  const stats = useMemo(() => ([
    {
      label: 'Chambres',
      value: HOTEL_FACTS.roomCount,
      hint: `${rooms.length} types geres (${HOTEL_FACTS.airConditionedRooms} climatisees, ${HOTEL_FACTS.ventilatedRooms} ventilees)`,
      icon: BedDouble,
      accent: 'bg-[linear-gradient(135deg,#7a2230,#c58b95)]',
    },
    {
      label: 'Salles',
      value: HOTEL_FACTS.eventSpaceCount,
      hint: `${spaces.length} espaces disponibles au dashboard`,
      icon: Sparkles,
      accent: 'bg-[linear-gradient(135deg,#94515d,#d6a2aa)]',
    },
    {
      label: 'Reservations',
      value: adminReservations.length,
      hint: 'Chambres et salles confondues',
      icon: CalendarDays,
      accent: 'bg-[linear-gradient(135deg,#6b1f2b,#b76e79)]',
    },
    {
      label: 'Messages',
      value: adminContacts.length + adminNewsletters.length,
      hint: `${adminContacts.length} contacts et ${adminNewsletters.length} inscriptions`,
      icon: Inbox,
      accent: 'bg-[linear-gradient(135deg,#8b3b49,#e2b3ba)]',
    },
  ]), [rooms.length, spaces.length, adminReservations.length, adminContacts.length, adminNewsletters.length])

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_READ_KEY, JSON.stringify(readNotificationIds))
  }, [readNotificationIds])

  const notifications = useMemo(() => {
    const fromReservations = adminReservations.slice(0, 8).map((reservation) => ({
      id: `reservation-${reservation.id}`,
      category: 'Reservation',
      targetSection: 'operations',
      actionLabel: 'Voir la reservation',
      tone: reservation.status === 'canceled' ? 'danger' : reservation.paymentStatus === 'pending' ? 'warning' : 'success',
      isUnread: !readNotificationIds.includes(`reservation-${reservation.id}`),
      title: reservation.status === 'canceled'
        ? 'Reservation annulee'
        : reservation.paymentStatus === 'completed'
          ? 'Reservation confirmee'
          : 'Nouvelle reservation a suivre',
      description: `${reservation.userName || reservation.userEmail || 'Client'} - ${reservation.roomName || reservation.spaceName || 'Reservation'}${reservation.checkIn ? ` (${reservation.checkIn} au ${reservation.checkOut})` : reservation.eventDate ? ` (${reservation.eventDate})` : ''}`,
      when: reservation.updatedAt || reservation.createdAt,
      whenLabel: formatRelativeDate(reservation.updatedAt || reservation.createdAt),
    }))

    const fromPayments = adminPayments.slice(0, 8).map((payment) => ({
      id: `payment-${payment.id}`,
      category: 'Paiement',
      targetSection: 'payments',
      actionLabel: payment.status === 'pending' ? 'Traiter le paiement' : 'Voir le paiement',
      tone: payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning',
      isUnread: !readNotificationIds.includes(`payment-${payment.id}`),
      title: payment.status === 'completed'
        ? 'Paiement recu'
        : payment.status === 'failed'
          ? 'Paiement echoue'
          : 'Paiement en attente',
      description: `${payment.reference} - ${Number(payment.amount || 0).toLocaleString('fr-FR')} XOF via ${payment.provider || 'PayGate'}`,
      when: payment.updatedAt || payment.createdAt,
      whenLabel: formatRelativeDate(payment.updatedAt || payment.createdAt),
    }))

    const fromContacts = adminContacts.slice(0, 8).map((contact) => ({
      id: `contact-${contact.id}`,
      category: 'Message',
      targetSection: 'inbox',
      actionLabel: 'Lire le message',
      tone: 'default',
      isUnread: !readNotificationIds.includes(`contact-${contact.id}`),
      title: 'Nouveau message de contact',
      description: `${contact.name || contact.email} - ${contact.message}`,
      when: contact.createdAt,
      whenLabel: formatRelativeDate(contact.createdAt),
    }))

    const fromNewsletters = adminNewsletters.slice(0, 8).map((newsletter) => ({
      id: `newsletter-${newsletter.id}`,
      category: 'Newsletter',
      targetSection: 'inbox',
      actionLabel: 'Voir les inscriptions',
      tone: 'default',
      isUnread: !readNotificationIds.includes(`newsletter-${newsletter.id}`),
      title: 'Nouvelle inscription newsletter',
      description: newsletter.email,
      when: newsletter.createdAt,
      whenLabel: formatRelativeDate(newsletter.createdAt),
    }))

    return [...fromReservations, ...fromPayments, ...fromContacts, ...fromNewsletters]
      .sort((a, b) => new Date(b.when || 0).getTime() - new Date(a.when || 0).getTime())
      .slice(0, 16)
  }, [adminReservations, adminPayments, adminContacts, adminNewsletters, readNotificationIds])

  const unreadNotificationCount = notifications.filter((item) => item.isUnread).length
  navItems[1].badgeCount = unreadNotificationCount

  const showFlash = (message) => {
    setFlash(message)
    window.clearTimeout(showFlash.timeoutId)
    showFlash.timeoutId = window.setTimeout(() => setFlash(''), 2600)
  }

  const loadAdminData = async () => {
    if (!authToken) return

    try {
      const [reservationsData, paymentsData, contactsData, newslettersData] = await Promise.all([
        apiGet('/api/admin/reservations', authToken),
        apiGet('/api/admin/payments', authToken),
        apiGet('/api/admin/contacts', authToken),
        apiGet('/api/admin/newsletters', authToken),
      ])
      setAdminReservations(reservationsData.reservations || [])
      setAdminPayments(paymentsData.payments || [])
      setAdminContacts(contactsData.contacts || [])
      setAdminNewsletters(newslettersData.newsletters || [])
    } catch {
      setAdminReservations([])
      setAdminPayments([])
      setAdminContacts([])
      setAdminNewsletters([])
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [authToken])

  const simulatePaymentStatus = async (reference, status = 'completed') => {
    await apiPost(`/api/admin/payments/${encodeURIComponent(reference)}/simulate`, { status }, authToken)
    await loadAdminData()
  }

  const handleCopyPaymentReference = async (reference) => {
    try {
      await navigator.clipboard.writeText(reference)
      showFlash('Reference copitee.')
    } catch {
      showFlash('Impossible de copier la reference sur ce navigateur.')
    }
  }

  const handleQuickSimulatePayment = async (reference) => {
    try {
      await simulatePaymentStatus(reference, 'completed')
      showFlash('Paiement marque completed.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleImagesSelected = async (event, setForm, setLoadingFlag) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    setLoadingFlag(true)

    try {
      const dataUrls = await Promise.all(files.map((file) => readFileAsDataUrl(file)))
      setForm((current) => {
        const mergedImages = uniqueList([...getFormImages(current), ...dataUrls])
        const nextMainImage = current.image || mergedImages[0] || ''

        return {
          ...current,
          image: nextMainImage,
          gallery: mergedImages.filter((item) => item !== nextMainImage).join(', '),
        }
      })
    } finally {
      setLoadingFlag(false)
      event.target.value = ''
    }
  }

  const handleEditRoom = (room) => {
    setActiveSection('rooms')
    setRoomForm({
      id: room.id,
      nameFr: room.name?.fr || '',
      nameEn: room.name?.en || '',
      price: String(room.price || ''),
      size: room.size || '',
      capacity: String(room.capacity || 2),
      image: room.image || '',
      gallery: uniqueList(room.gallery || []).filter((item) => item !== room.image).join(', '),
      descriptionFr: room.description?.fr || '',
      descriptionEn: room.description?.en || '',
      amenitiesFr: (room.amenities || []).map((item) => item.fr || item).join(', '),
      amenitiesEn: (room.amenities || []).map((item) => item.en || item).join(', '),
      highlightsFr: (room.highlights?.fr || []).join(', '),
      highlightsEn: (room.highlights?.en || []).join(', '),
      featured: Boolean(room.featured),
    })
  }

  const handleEditSpace = (space) => {
    setActiveSection('spaces')
    setSpaceForm({
      id: space.id,
      titleFr: space.title?.fr || '',
      titleEn: space.title?.en || '',
      textFr: space.text?.fr || '',
      textEn: space.text?.en || '',
      descriptionFr: space.description?.fr || '',
      descriptionEn: space.description?.en || '',
      image: space.image || '',
      gallery: uniqueList(space.gallery || []).filter((item) => item !== space.image).join(', '),
      highlightsFr: (space.highlights?.fr || []).join(', '),
      highlightsEn: (space.highlights?.en || []).join(', '),
      accent: space.accent || 'from-[#f7d7de] to-[#7a2230]',
    })
  }

  const handleEditTestimonial = (testimonial) => {
    setActiveSection('content')
    setTestimonialForm({
      id: testimonial.id,
      name: testimonial.name || '',
      roleFr: testimonial.role?.fr || '',
      roleEn: testimonial.role?.en || '',
      textFr: testimonial.text?.fr || '',
      textEn: testimonial.text?.en || '',
    })
  }

  const handleSubmitRoom = async (event) => {
    event.preventDefault()
    const nameFr = roomForm.nameFr.trim()
    const image = roomForm.image.trim()

    if (!nameFr || !image) {
      showFlash('Le nom de la chambre et l image principale sont obligatoires.')
      return
    }

    const amenitiesFr = splitList(roomForm.amenitiesFr)
    const amenitiesEn = splitList(roomForm.amenitiesEn)
    const highlightsFr = splitList(roomForm.highlightsFr)
    const highlightsEn = splitList(roomForm.highlightsEn)

    const payload = {
      slug: slugify(roomForm.nameFr),
      name: toLocalized(roomForm.nameFr, roomForm.nameEn),
      price: Number(roomForm.price || 0),
      size: roomForm.size.trim() || '20 m2',
      capacity: Number(roomForm.capacity || 2),
      description: toLocalized(roomForm.descriptionFr, roomForm.descriptionEn),
      amenities: amenitiesFr.map((item, index) => ({ fr: item, en: amenitiesEn[index] || item })),
      image,
      gallery: uniqueList([image, ...splitList(roomForm.gallery)]),
      featured: roomForm.featured,
      highlights: {
        fr: highlightsFr,
        en: highlightsEn.length ? highlightsEn : highlightsFr,
      },
    }

    try {
      if (roomForm.id) {
        await updateRoom(roomForm.id, payload)
        showFlash('Chambre mise a jour avec succes.')
      } else {
        await addRoom(payload)
        showFlash('Chambre ajoutee avec succes.')
      }
      setRoomForm(emptyRoomForm())
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleSubmitSpace = async (event) => {
    event.preventDefault()
    const titleFr = spaceForm.titleFr.trim()
    const image = spaceForm.image.trim()

    if (!titleFr || !image) {
      showFlash('Le nom de la salle et l image principale sont obligatoires.')
      return
    }

    const highlightsFr = splitList(spaceForm.highlightsFr)
    const highlightsEn = splitList(spaceForm.highlightsEn)

    const payload = {
      slug: slugify(spaceForm.titleFr),
      title: toLocalized(spaceForm.titleFr, spaceForm.titleEn),
      text: toLocalized(spaceForm.textFr, spaceForm.textEn),
      description: toLocalized(spaceForm.descriptionFr, spaceForm.descriptionEn),
      image,
      gallery: uniqueList([image, ...splitList(spaceForm.gallery)]),
      accent: spaceForm.accent.trim() || 'from-[#f7d7de] to-[#7a2230]',
      highlights: {
        fr: highlightsFr,
        en: highlightsEn.length ? highlightsEn : highlightsFr,
      },
    }

    try {
      if (spaceForm.id) {
        await updateSpace(spaceForm.id, payload)
        showFlash('Salle mise a jour avec succes.')
      } else {
        await addSpace(payload)
        showFlash('Salle ajoutee avec succes.')
      }
      setSpaceForm(emptySpaceForm())
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleSubmitTestimonial = async (event) => {
    event.preventDefault()

    if (!testimonialForm.name.trim() || !testimonialForm.textFr.trim()) {
      showFlash('Le nom et le texte francais du temoignage sont obligatoires.')
      return
    }

    const payload = {
      name: testimonialForm.name.trim(),
      role: toLocalized(testimonialForm.roleFr, testimonialForm.roleEn),
      text: toLocalized(testimonialForm.textFr, testimonialForm.textEn),
    }

    try {
      if (testimonialForm.id) {
        await updateTestimonial(testimonialForm.id, payload)
        showFlash('Temoignage mis a jour avec succes.')
      } else {
        await addTestimonial(payload)
        showFlash('Temoignage ajoute avec succes.')
      }
      setTestimonialForm(emptyTestimonialForm())
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id)
      if (Number(roomForm.id) === Number(id)) setRoomForm(emptyRoomForm())
      showFlash('Chambre supprimee.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleDeleteSpace = async (id) => {
    try {
      await deleteSpace(id)
      if (Number(spaceForm.id) === Number(id)) setSpaceForm(emptySpaceForm())
      showFlash('Salle supprimee.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleDeleteTestimonial = async (id) => {
    try {
      await deleteTestimonial(id)
      if (Number(testimonialForm.id) === Number(id)) setTestimonialForm(emptyTestimonialForm())
      showFlash('Temoignage supprime.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      await apiPost(`/api/admin/reservations/${reservationId}/cancel`, {}, authToken)
      await loadAdminData()
      showFlash('Reservation annulee.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleSimulatePayment = async (event) => {
    event.preventDefault()

    if (!paymentSimulationForm.reference.trim()) {
      showFlash('La reference de paiement est obligatoire pour la simulation.')
      return
    }

    try {
      await simulatePaymentStatus(paymentSimulationForm.reference.trim(), paymentSimulationForm.status)
      setPaymentSimulationForm(emptyPaymentSimulationForm())
      showFlash('Callback PayGate simule avec succes.')
    } catch (error) {
      showFlash(error.message)
    }
  }

  const handleOpenNotification = (notification) => {
    if (!notification?.targetSection) return
    setReadNotificationIds((current) => (current.includes(notification.id) ? current : [...current, notification.id]))
    setActiveSection(notification.targetSection)
    showFlash(`Ouverture de la section ${notification.targetSection}.`)
  }

  const handleMarkNotificationAsRead = (notificationId) => {
    setReadNotificationIds((current) => (current.includes(notificationId) ? current : [...current, notificationId]))
  }

  const handleMarkAllNotificationsAsRead = () => {
    setReadNotificationIds((current) => {
      const next = new Set(current)
      notifications.forEach((notification) => next.add(notification.id))
      return Array.from(next)
    })
    showFlash('Toutes les notifications sont marquees comme lues.')
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'rooms':
        return (
          <AdminRoomsPanel
            roomForm={roomForm}
            setRoomForm={setRoomForm}
            handleSubmitRoom={handleSubmitRoom}
            handleImagesSelected={handleImagesSelected}
            setIsUploadingRoomImages={setIsUploadingRoomImages}
            isUploadingRoomImages={isUploadingRoomImages}
            roomFormImages={roomFormImages}
            removeImageFromForm={removeImageFromForm}
            rooms={rooms}
            handleEditRoom={handleEditRoom}
            handleDeleteRoom={handleDeleteRoom}
            emptyRoomForm={emptyRoomForm}
          />
        )
      case 'notifications':
        return (
          <AdminNotificationsPanel
            notifications={notifications}
            onOpenNotification={handleOpenNotification}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          />
        )
      case 'spaces':
        return (
          <AdminSpacesPanel
            spaceForm={spaceForm}
            setSpaceForm={setSpaceForm}
            handleSubmitSpace={handleSubmitSpace}
            handleImagesSelected={handleImagesSelected}
            setIsUploadingSpaceImages={setIsUploadingSpaceImages}
            isUploadingSpaceImages={isUploadingSpaceImages}
            spaceFormImages={spaceFormImages}
            removeImageFromForm={removeImageFromForm}
            spaces={spaces}
            handleEditSpace={handleEditSpace}
            handleDeleteSpace={handleDeleteSpace}
            emptySpaceForm={emptySpaceForm}
          />
        )
      case 'content':
        return (
          <AdminContentPanel
            testimonialForm={testimonialForm}
            setTestimonialForm={setTestimonialForm}
            handleSubmitTestimonial={handleSubmitTestimonial}
            testimonials={testimonials}
            handleEditTestimonial={handleEditTestimonial}
            handleDeleteTestimonial={handleDeleteTestimonial}
            emptyTestimonialForm={emptyTestimonialForm}
          />
        )
      case 'operations':
        return <AdminOperationsPanel adminReservations={adminReservations} handleCancelReservation={handleCancelReservation} />
      case 'payments':
        return (
          <AdminPaymentsPanel
            paymentSimulationForm={paymentSimulationForm}
            setPaymentSimulationForm={setPaymentSimulationForm}
            handleSimulatePayment={handleSimulatePayment}
            adminPayments={adminPayments}
            handleCopyPaymentReference={handleCopyPaymentReference}
            handleQuickSimulatePayment={handleQuickSimulatePayment}
            handlePrefillSimulation={(reference) => {
              setPaymentSimulationForm({ reference, status: 'completed' })
              setActiveSection('payments')
              showFlash('Reference pre-remplie dans la simulation.')
            }}
          />
        )
      case 'inbox':
        return <AdminInboxPanel adminContacts={adminContacts} adminNewsletters={adminNewsletters} />
      case 'settings':
        return <AdminSettingsPanel navigate={navigate} setActiveSection={setActiveSection} user={user} logout={logout} />
      default:
        return <AdminOverviewPanel stats={stats} adminReservations={adminReservations} setActiveSection={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff9f7_0%,#f7eaea_42%,#efd8dd_100%)] text-[#2f1b1f]">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar navItems={navItems} activeSection={activeSection} setActiveSection={setActiveSection} user={user} logout={logout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:pl-0">
          <div className="mx-auto max-w-[1600px]">
            <AdminTopbar
              navigate={navigate}
              setActiveSection={setActiveSection}
              onOpenMenu={() => setIsSidebarOpen(true)}
              activeSectionLabel={activeSectionLabel}
              notificationCount={unreadNotificationCount}
              notifications={notifications}
              onOpenNotification={handleOpenNotification}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
            />

            {flash ? (
              <div className="mt-5 rounded-[22px] border border-[#d8b0b8] bg-[#fff6f4] px-5 py-4 text-sm text-[#7a2230]">
                {flash}
              </div>
            ) : null}

            <div className="mt-6">{renderSection()}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, isAdmin } = useSiteData()

  if (!user) {
    return <AdminLoginCard />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff8f6_0%,#f7eaea_42%,#efd6db_100%)] px-4 py-10 text-[#2f1b1f] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[36px] border border-[#7a2230]/10 bg-white/78 p-10 shadow-[0_35px_120px_rgba(122,34,48,0.12)] backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a07a82]">Acces refuse</p>
          <h1 className="mt-4 font-serif text-5xl text-[#2f1b1f]">Compte sans droits admin</h1>
          <p className="mt-5 text-sm leading-8 text-[#7a5c61]">Ce compte n a pas acces au dashboard d administration separe.</p>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}
