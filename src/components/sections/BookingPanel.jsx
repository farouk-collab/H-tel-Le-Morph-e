import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { formatPrice, buildWhatsAppLink } from '../../lib/format'
import { pickLocalized } from '../../lib/i18n'

const whatsappPhone = '+22892727278'

export default function BookingPanel({ selectedRoom, booking, onSubmit = async () => ({ ok: true }), isAuthenticated = false }) {
  const { language } = useLanguage()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    eventSpace: false,
    paymentMethod: 'counter',
    privacyConsent: false,
  })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const roomName = pickLocalized(selectedRoom?.name, language) || 'CH101'
  const roomAmenities = (selectedRoom?.amenities || []).map((item) => pickLocalized(item, language))

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.phone.trim()) {
      setFeedback(language === 'fr' ? 'Le nom et le téléphone sont obligatoires.' : 'Name and phone are required.')
      return
    }

    if (!form.privacyConsent) {
      setFeedback(language === 'fr' ? 'Veuillez accepter l’information sur le traitement de vos données avant d’envoyer la demande.' : 'Please accept the privacy notice before sending your request.')
      return
    }

    setLoading(true)
    const result = await onSubmit({
      ...form,
      roomId: selectedRoom?.id,
      roomName,
    })
    setLoading(false)

    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    setForm({ name: '', email: '', phone: '', message: '', eventSpace: false, paymentMethod: 'counter', privacyConsent: false })
    setFeedback(result.message || (language === 'fr' ? 'Demande enregistrée.' : 'Request saved.'))
  }

  const whatsappMessage = language === 'fr'
    ? `Bonjour, je souhaite réserver ${roomName} à l’Hôtel Le Morphée.`
    : `Hello, I would like to book ${roomName} at Hôtel Le Morphée.`

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10" id="reservation">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] bg-[#7a2230] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">{language === 'fr' ? 'Réservation' : 'Reservation'}</p>
          <h2 className="mt-3 font-serif text-4xl">{language === 'fr' ? 'Finalisez votre demande' : 'Finalize your request'}</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            {language === 'fr'
              ? 'Les demandes sont désormais rattachées à votre compte client pour vous permettre de suivre vos réservations et paiements.'
              : 'Requests are now linked to your customer account so you can track reservations and payments.'}
          </p>

          <div className="mt-8 rounded-[24px] bg-white/12 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">{language === 'fr' ? 'Chambre sélectionnée' : 'Selected room'}</p>
            <h3 className="mt-3 font-serif text-3xl">{roomName}</h3>
            <p className="mt-2 text-sm text-white/70">{formatPrice(selectedRoom?.price || 22500, language === 'fr' ? 'fr-FR' : 'en-US')}</p>
            <p className="mt-2 text-sm text-white/70">Séjour : {booking?.checkIn || '...'} au {booking?.checkOut || '...'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {roomAmenities.map((item) => (
                <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{item}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/15 p-5 text-sm text-white/80">
            {language === 'fr'
              ? 'Paiements prévus : comptoir, Flooz ou TMoney selon disponibilité du compte marchand. Les données de réservation sont visibles depuis votre espace client.'
              : 'Payment methods: counter, Flooz or TMoney depending on merchant setup. Reservation data is visible in your customer account.'}
          </div>
        </article>

        <article className="rounded-[30px] bg-white p-8 shadow-xl shadow-black/5">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Nom complet' : 'Full name'}</label>
                <input value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Téléphone' : 'Phone'}</label>
                <input value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Demande particulière' : 'Special request'}</label>
                <textarea value={form.message} onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))} className="min-h-[120px] w-full rounded-2xl border border-black/10 p-4" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">Mode de paiement</label>
                <select value={form.paymentMethod} onChange={(event) => setForm((state) => ({ ...state, paymentMethod: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4">
                  <option value="counter">Paiement sur place</option>
                  <option value="flooz">Flooz</option>
                  <option value="tmoney">TMoney</option>
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 text-sm">
                <input type="checkbox" checked={form.eventSpace} onChange={(event) => setForm((state) => ({ ...state, eventSpace: event.target.checked }))} />
                {language === 'fr' ? 'Demander aussi la salle de conférence ou la place des fêtes' : 'Also request the conference room or event venue'}
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-black/10 p-4 text-sm leading-7">
                <input type="checkbox" checked={form.privacyConsent} onChange={(event) => setForm((state) => ({ ...state, privacyConsent: event.target.checked }))} className="mt-1" />
                <span>
                  J’ai pris connaissance des informations relatives au traitement de mes données pour la gestion de ma réservation et de mon paiement. <Link to="/confidentialite" className="font-semibold text-[#7a2230] underline">Voir la politique de confidentialité</Link>
                </span>
              </label>
            </div>

            {!isAuthenticated ? (
              <div className="mt-5 rounded-2xl bg-[#fcf4f5] px-4 py-3 text-sm text-black/70">
                Connectez-vous ou créez un compte pour enregistrer votre réservation et retrouver l’historique de paiement. <Link to="/mon-compte" className="font-semibold text-[#7a2230] underline">Accéder à mon compte</Link>
              </div>
            ) : null}

            {feedback ? <p className="mt-4 text-sm text-[#7a2230]">{feedback}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" disabled={loading} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Traitement...' : language === 'fr' ? 'Envoyer la demande' : 'Send request'}</button>
              <a href={buildWhatsAppLink(whatsappPhone, whatsappMessage)} target="_blank" rel="noreferrer" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                WhatsApp
              </a>
            </div>
          </form>
        </article>
      </div>
    </section>
  )
}
