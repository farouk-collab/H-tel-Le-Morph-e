import { ChevronLeft, Check, MessageCircleMore } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from '../context/SiteDataContext'
import { buildWhatsAppLink } from '../lib/format'
import { pickLocalized } from '../lib/i18n'

const whatsappPhone = '+22892727278'

export default function SpaceDetail() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const { spaces } = useSiteData()
  const space = useMemo(() => spaces.find((item) => item.slug === slug), [spaces, slug])
  const [activeImage, setActiveImage] = useState(0)

  if (!space) {
    return (
      <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
        <Navbar />
        <main className="section-wrap py-24">
          <h1 className="font-serif text-5xl">{language === 'fr' ? 'Espace introuvable' : 'Space not found'}</h1>
          <p className="mt-4 text-black/70">{language === 'fr' ? 'Le lien demandé ne correspond à aucun espace.' : 'The requested link does not match any space.'}</p>
          <Link to="/" className="mt-8 inline-flex rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">
            {language === 'fr' ? 'Retour accueil' : 'Back home'}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const title = pickLocalized(space.title, language)
  const text = pickLocalized(space.text, language)
  const description = pickLocalized(space.description, language)
  const highlights = space.highlights?.[language] ?? space.highlights?.fr ?? []
  const gallery = space.gallery?.length ? space.gallery : [space.image]
  const whatsappMessage = language === 'fr'
    ? `Bonjour, je souhaite obtenir des informations sur ${title} à l’Hôtel Le Morphée.`
    : `Hello, I would like more information about ${title} at Hôtel Le Morphée.`

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={() => { window.location.href = '/#contact' }} />

      <main className="section-wrap py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 hover:text-black">
          <ChevronLeft size={16} />
          {language === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/5">
              <img src={gallery[activeImage]} alt={title} className="h-[460px] w-full object-cover" />
              <div className="grid grid-cols-3 gap-2 bg-[#fcf4f5] p-3">
                {gallery.map((image, index) => (
                  <button key={`${space.slug}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-[18px] ${index === activeImage ? 'ring-2 ring-[#7a2230]' : ''}`}>
                    <img src={image} alt={`${title} ${index + 1}`} className="h-24 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">{language === 'fr' ? 'Détail espace' : 'Space detail'}</p>
              <h1 className="mt-3 font-serif text-5xl">{title}</h1>
              <p className="mt-4 text-sm leading-8 text-black/75">{text}</p>
              <p className="mt-4 text-sm leading-8 text-black/70">{description}</p>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
              <h2 className="font-serif text-3xl">{language === 'fr' ? 'Points forts' : 'Highlights'}</h2>
              <div className="mt-5 grid gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#fcf4f5] px-4 py-3 text-sm text-black/80">
                    <Check size={16} className="text-[#7a2230]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
              <h2 className="font-serif text-3xl">{language === 'fr' ? 'Contacter pour cet espace' : 'Contact for this space'}</h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#contact" className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">
                  {language === 'fr' ? 'Demander une réservation' : 'Request a booking'}
                </a>
                <a href={buildWhatsAppLink(whatsappPhone, whatsappMessage)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
                  <MessageCircleMore size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
