import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { buildWhatsAppLink } from '../../lib/format'
import { pickLocalized } from '../../lib/i18n'

const whatsappPhone = '+22892727278'

export default function SpaceBookingPanel({ spaces, onSubmit = async () => ({ ok: true }), isAuthenticated = false }) {
  const { language } = useLanguage()
  const [selectedSpaceId, setSelectedSpaceId] = useState(() => String(spaces[0]?.id || ''))
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    attendees: '20',
    amount: '',
    paymentMethod: 'counter',
    message: '',
    privacyConsent: false,
  })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!spaces.length) return
    setSelectedSpaceId((current) => current || String(spaces[0].id))
  }, [spaces])

  const selectedSpace = useMemo(() => {
    if (!spaces.length) return null
    return spaces.find((item) => String(item.id) === selectedSpaceId) || spaces[0]
  }, [spaces, selectedSpaceId])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.phone.trim() || !selectedSpace?.id) {
      setFeedback(language === 'fr' ? 'Le nom, le téléphone et la salle sont obligatoires.' : 'Name, phone, and venue are required.')
      return
    }

    if (!form.privacyConsent) {
      setFeedback(language === 'fr' ? 'Veuillez accepter l’information sur le traitement de vos données avant d’envoyer la demande.' : 'Please accept the privacy notice before sending your request.')
      return
    }

    setLoading(true)
    const result = await onSubmit({
      ...form,
      spaceId: selectedSpace.id,
      amount: Number(form.amount || 0),
      attendees: Number(form.attendees || 1),
      spaceName: pickLocalized(selectedSpace.title, language),
    })
    setLoading(false)

    if (!result.ok) {
      setFeedback(result.message)
      return
    }

    setForm({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      attendees: '20',
      amount: '',
      paymentMethod: 'counter',
      message: '',
      privacyConsent: false,
    })
    setFeedback(result.message || (language === 'fr' ? 'Demande de salle enregistrée.' : 'Venue request saved.'))
  }

  const whatsappMessage = language === 'fr'
    ? `Bonjour, je souhaite réserver la salle ${pickLocalized(selectedSpace?.title, language) || 'de l’hôtel'} à l’Hôtel Le Morphée.`
    : `Hello, I would like to book the ${pickLocalized(selectedSpace?.title, language) || 'hotel venue'} at Hôtel Le Morphée.`

  if (!spaces.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10" id="reservation-salles">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[30px] bg-[#171717] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">{language === 'fr' ? 'Réservation de salle' : 'Venue booking'}</p>
          <h2 className="mt-3 font-serif text-4xl">{language === 'fr' ? 'Organisez votre événement' : 'Plan your event'}</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">
            {language === 'fr'
              ? 'Utilisez ce formulaire dédié pour les salles, espaces de conférence et événements. La demande est enregistrée séparément des chambres.'
              : 'Use this dedicated form for venues, conference spaces, and events. The request is stored separately from room bookings.'}
          </p>

          <div className="mt-8 rounded-[24px] bg-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">{language === 'fr' ? 'Espace sélectionné' : 'Selected venue'}</p>
            <h3 className="mt-3 font-serif text-3xl">{pickLocalized(selectedSpace?.title, language)}</h3>
            <p className="mt-2 text-sm text-white/70">{pickLocalized(selectedSpace?.text, language)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(selectedSpace?.highlights?.[language] || selectedSpace?.highlights?.fr || []).map((item) => (
                <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">{item}</span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/15 p-5 text-sm text-white/80">
            {language === 'fr'
              ? 'Si vous renseignez un acompte ou un montant convenu, il pourra être suivi dans votre compte avec l’historique des paiements.'
              : 'If you provide a deposit or agreed amount, it can be tracked in your account with payment history.'}
          </div>
        </article>

        <article className="rounded-[30px] bg-white p-8 shadow-xl shadow-black/5">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Salle ou espace' : 'Venue or space'}</label>
              <select value={selectedSpaceId} onChange={(event) => setSelectedSpaceId(event.target.value)} className="h-12 w-full rounded-2xl border border-black/10 px-4">
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>{pickLocalized(space.title, language)}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Nom complet' : 'Full name'}</label>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Téléphone' : 'Phone'}</label>
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Date souhaitée' : 'Preferred date'}</label>
                <input type="date" value={form.eventDate} onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Nombre de participants' : 'Attendees'}</label>
                <input value={form.attendees} onChange={(event) => setForm((current) => ({ ...current, attendees: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Montant convenu ou acompte (XOF)' : 'Agreed amount or deposit (XOF)'}</label>
                <input value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Mode de paiement' : 'Payment method'}</label>
              <select value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4">
                <option value="counter">{language === 'fr' ? 'Paiement sur place' : 'Pay on site'}</option>
                <option value="flooz">Flooz</option>
                <option value="tmoney">TMoney</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">{language === 'fr' ? 'Précisions sur l’événement' : 'Event details'}</label>
              <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="min-h-[120px] w-full rounded-2xl border border-black/10 p-4" />
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-black/10 p-4 text-sm leading-7">
              <input type="checkbox" checked={form.privacyConsent} onChange={(event) => setForm((current) => ({ ...current, privacyConsent: event.target.checked }))} className="mt-1" />
              <span>
                J’ai pris connaissance des informations relatives au traitement de mes données pour la gestion de ma réservation de salle et, si besoin, de mon paiement. <Link to="/confidentialite" className="font-semibold text-[#7a2230] underline">Voir la politique de confidentialité</Link>
              </span>
            </label>

            {!isAuthenticated ? (
              <div className="rounded-2xl bg-[#fcf4f5] px-4 py-3 text-sm text-black/70">
                Connectez-vous ou créez un compte pour enregistrer votre demande de salle et retrouver l’historique. <Link to="/mon-compte" className="font-semibold text-[#7a2230] underline">Accéder à mon compte</Link>
              </div>
            ) : null}

            {feedback ? <p className="text-sm text-[#7a2230]">{feedback}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={loading} className="rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {loading ? 'Traitement...' : language === 'fr' ? 'Envoyer la demande de salle' : 'Send venue request'}
              </button>
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

