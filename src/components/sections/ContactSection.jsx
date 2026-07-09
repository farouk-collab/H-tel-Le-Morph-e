import { ExternalLink, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import SectionTitle from '../ui/SectionTitle'

const contactCards = [
  ['Adresse', "Rue 168 TOT, Lome-Totsi, deuxieme von a gauche apres l'Eglise Catholique"],
  ['Telephone', '(+228) 92 72 72 78'],
  ['Autres numeros', '(+228) 22 25 77 60 / (+228) 93 07 08 61'],
  ['Email', 'lemorphee28@gmail.com / hotellemorphee8@gmail.com'],
  ['Repere', 'Pres de la paroisse Saint-Esprit de Totsi et du marche de Totsi'],
]

export default function ContactSection() {
  const { submitContact } = useSiteData()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFeedback('Merci de renseigner votre nom, votre email et votre message.')
      return
    }

    if (!form.consent) {
      setFeedback("Merci d'accepter le traitement de vos donnees avant l'envoi.")
      return
    }

    setLoading(true)
    setFeedback('')

    try {
      await submitContact(form)
      setForm({ name: '', email: '', phone: '', message: '', consent: false })
      setFeedback('Message envoye. Notre equipe pourra vous recontacter rapidement.')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-wrap grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionTitle
          eyebrow="Contact"
          title="Retrouvez l'hotel a Totsivi"
          text="Les coordonnees ci-dessous reprennent les informations publiques disponibles pour l'Hotel Le Morphee a Lome."
        />

        <div className="mt-8 grid gap-4">
          {contactCards.map(([title, text], index) => (
            <motion.div
              key={title}
              className="rounded-[24px] bg-white p-5 shadow-lg shadow-black/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              whileHover={{ y: -4, rotateX: -3, rotateY: 3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm text-black/75">{text}</p>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-[32px] bg-white p-6 shadow-xl shadow-black/5">
          <p className="text-xs uppercase tracking-[0.3em] text-black/45">Message direct</p>
          <h3 className="mt-3 font-serif text-3xl text-[#171717]">Ecrire a l'hotel</h3>
          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom complet"
                className="h-12 rounded-2xl border border-black/10 px-4"
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="Email"
                className="h-12 rounded-2xl border border-black/10 px-4"
              />
            </div>
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Telephone"
              className="h-12 rounded-2xl border border-black/10 px-4"
            />
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              placeholder="Votre message"
              className="min-h-[140px] rounded-2xl border border-black/10 p-4"
            />
            <label className="flex items-start gap-3 rounded-2xl border border-black/10 p-4 text-sm leading-7 text-black/70">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
                className="mt-1"
              />
              <span>J'accepte d'etre recontacte par l'hotel au sujet de ma demande.</span>
            </label>
            {feedback ? <p className="text-sm text-[#7a2230]">{feedback}</p> : null}
            <button type="submit" disabled={loading} className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </div>
        </form>
      </div>

      <motion.div
        className="overflow-hidden rounded-[32px] bg-white p-3 shadow-2xl shadow-black/10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -6, rotateX: -4, rotateY: 4 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="overflow-hidden rounded-[28px] border border-black/5">
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,#7f1d2d,#d8a2ad)] px-5 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Localisation</p>
              <h3 className="mt-2 font-serif text-3xl">Rue 168 TOT, Totsivi</h3>
            </div>
            <MapPin className="shrink-0" size={22} />
          </div>

          <iframe
            title="Carte Hotel Le Morphee"
            src="https://www.openstreetmap.org/export/embed.html?bbox=1.1815%2C6.1937%2C1.1870%2C6.1978&layer=mapnik&marker=6.19584%2C1.18426"
            className="h-[360px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="flex flex-col gap-3 bg-[#fcf6f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-black/75">Coordonnees : 6.19584, 1.18426</div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.openstreetmap.org/?mlat=6.19584&mlon=1.18426#map=18/6.19584/1.18426"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                <ExternalLink size={16} />
                Ouvrir la carte
              </a>
              <a
                href="tel:+22892727278"
                className="inline-flex items-center gap-2 rounded-full bg-[#7a2230] px-4 py-2 text-sm font-semibold text-white"
              >
                <Phone size={16} />
                Appeler
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
