import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import AvailabilityBanner from '../components/sections/AvailabilityBanner'
import BookingPanel from '../components/sections/BookingPanel'
import ContactSection from '../components/sections/ContactSection'
import FAQSection from '../components/sections/FAQSection'
import GallerySection from '../components/sections/GallerySection'
import Hero from '../components/sections/Hero'
import OffersSection from '../components/sections/OffersSection'
import RoomsSection from '../components/sections/RoomsSection'
import ServicesSection from '../components/sections/ServicesSection'
import SpaceBookingPanel from '../components/sections/SpaceBookingPanel'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import { useSiteData } from '../context/SiteDataContext'

export default function Home() {
  const navigate = useNavigate()
  const { rooms, spaces, offers, testimonials, user, addReservation, addSpaceReservation, initiatePayment, addNewsletter } = useSiteData()
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: '2' })
  const [availability, setAvailability] = useState(null)
  const [search, setSearch] = useState('')
  const [capacityFilter, setCapacityFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')
  const [selectedRoom, setSelectedRoom] = useState(rooms[0] ?? null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterConsent, setNewsletterConsent] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState('')

  useEffect(() => {
    if (!rooms.length) {
      setSelectedRoom(null)
      return
    }

    setSelectedRoom((current) => {
      if (!current) return rooms[0]
      const updated = rooms.find((room) => room.id === current.id)
      return updated ?? rooms[0]
    })
  }, [rooms])

  const handleSearch = () => {
    setAvailability({
      title: 'Des chambres semblent disponibles pour votre sélection',
      text: 'Vous pouvez maintenant créer une réservation depuis votre compte client, puis suivre le paiement et l’historique dans un espace dédié.',
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
    })
    document.getElementById('chambres')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBookNow = (room) => {
    if (room) setSelectedRoom(room)
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBookingSubmit = async (payload) => {
    if (!user) {
      navigate('/mon-compte')
      return { ok: false, message: 'Connectez-vous pour finaliser la réservation et suivre le paiement.' }
    }

    try {
      const reservation = await addReservation({
        roomId: selectedRoom?.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        note: payload.message,
        paymentMethod: payload.paymentMethod,
        phone: payload.phone,
        email: payload.email,
        customerName: payload.name,
      })

      if (payload.paymentMethod === 'flooz' || payload.paymentMethod === 'tmoney') {
        await initiatePayment({ reservationId: reservation.id, provider: payload.paymentMethod, phone: payload.phone, amount: selectedRoom?.price })
      }

      navigate('/mon-compte')
      return { ok: true, message: 'Réservation de chambre enregistrée dans votre compte.' }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const handleSpaceBookingSubmit = async (payload) => {
    if (!user) {
      navigate('/mon-compte')
      return { ok: false, message: 'Connectez-vous pour enregistrer votre demande de salle.' }
    }

    try {
      const reservation = await addSpaceReservation({
        spaceId: payload.spaceId,
        eventDate: payload.eventDate,
        attendees: payload.attendees,
        amount: payload.amount,
        note: payload.message,
        paymentMethod: payload.paymentMethod,
        phone: payload.phone,
        email: payload.email,
        customerName: payload.name,
      })

      if ((payload.paymentMethod === 'flooz' || payload.paymentMethod === 'tmoney') && Number(payload.amount || 0) > 0) {
        await initiatePayment({ reservationId: reservation.id, provider: payload.paymentMethod, phone: payload.phone, amount: payload.amount })
      }

      navigate('/mon-compte')
      return { ok: true, message: 'Demande de salle enregistrée dans votre compte.' }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const handleNewsletterSubmit = (event) => {
    event.preventDefault()

    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterMessage('Veuillez saisir un email valide.')
      return
    }

    if (!newsletterConsent) {
      setNewsletterMessage('Veuillez confirmer votre accord avant de vous inscrire.')
      return
    }

    addNewsletter(newsletterEmail.trim())
    setNewsletterEmail('')
    setNewsletterConsent(false)
    setNewsletterMessage('Demande d’inscription enregistrée. Vous pouvez aussi nous contacter directement par email.')
  }

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={() => handleBookNow(selectedRoom)} />

      <Hero booking={booking} setBooking={setBooking} onSearch={handleSearch} />
      <AvailabilityBanner result={availability} />
      <OffersSection offers={offers} />
      <RoomsSection
        rooms={rooms}
        onBookNow={handleBookNow}
        search={search}
        setSearch={setSearch}
        capacityFilter={capacityFilter}
        setCapacityFilter={setCapacityFilter}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
      />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection testimonials={testimonials} />
      <BookingPanel selectedRoom={selectedRoom} booking={booking} onSubmit={handleBookingSubmit} isAuthenticated={!!user} />
      <SpaceBookingPanel spaces={spaces} onSubmit={handleSpaceBookingSubmit} isAuthenticated={!!user} />
      <FAQSection />
      <ContactSection />
      <Footer
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterConsent={newsletterConsent}
        setNewsletterConsent={setNewsletterConsent}
        onNewsletterSubmit={handleNewsletterSubmit}
        newsletterMessage={newsletterMessage}
      />
    </div>
  )
}
