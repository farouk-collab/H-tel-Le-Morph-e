import { ChevronLeft, Check, MessageCircleMore } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from '../context/SiteDataContext'
import { buildWhatsAppLink, formatPrice } from '../lib/format'
import { pickLocalized } from '../lib/i18n'

const whatsappPhone = '+22892727278'

export default function RoomDetail() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const { rooms } = useSiteData()
  const room = useMemo(() => rooms.find((item) => item.slug === slug), [rooms, slug])
  const [activeImage, setActiveImage] = useState(0)

  if (!room) {
    return (
      <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
        <Navbar />
        <main className="section-wrap py-24">
          <h1 className="font-serif text-5xl">{language === 'fr' ? 'Chambre introuvable' : 'Room not found'}</h1>
          <p className="mt-4 text-black/70">{language === 'fr' ? 'Le lien demandé ne correspond à aucune chambre.' : 'The requested link does not match any room.'}</p>
          <Link to="/" className="mt-8 inline-flex rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">
            {language === 'fr' ? 'Retour à l’accueil' : 'Back home'}
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const name = pickLocalized(room.name, language)
  const description = pickLocalized(room.description, language)
  const highlights = room.highlights?.[language] ?? room.highlights?.fr ?? []
  const amenities = room.amenities.map((item) => pickLocalized(item, language))
  const gallery = room.gallery?.length ? room.gallery : [room.image]
  const whatsappMessage = language === 'fr'
    ? `Bonjour, je souhaite réserver ${name} à l’Hôtel Le Morphée.`
    : `Hello, I would like to book ${name} at Hôtel Le Morphée.`

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={() => { window.location.href = '/#reservation' }} />

      <main className="section-wrap py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 hover:text-black">
          <ChevronLeft size={16} />
          {language === 'fr' ? 'Retour à l’accueil' : 'Back to home'}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/5">
              <img src={gallery[activeImage]} alt={name} className="h-[460px] w-full object-cover" />
              <div className="grid grid-cols-4 gap-2 bg-[#fcf4f5] p-3">
                {gallery.map((image, index) => (
                  <button key={`${room.slug}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-[18px] ${index === activeImage ? 'ring-2 ring-[#7a2230]' : ''}`}>
                    <img src={image} alt={`${name} ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">{language === 'fr' ? 'Détail chambre' : 'Room detail'}</p>
              <h1 className="mt-3 font-serif text-5xl">{name}</h1>
              <p className="mt-3 text-lg text-[#7a2230]">{formatPrice(room.price, language === 'fr' ? 'fr-FR' : 'en-US')} / {language === 'fr' ? 'nuit' : 'night'}</p>
              <p className="mt-5 text-sm leading-8 text-black/75">{description}</p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-[#ebc9cf] px-4 py-2 font-semibold text-black/75">{room.size}</span>
                <span className="rounded-full bg-[#ebc9cf] px-4 py-2 font-semibold text-black/75">{room.capacity} {language === 'fr' ? 'personnes' : 'guests'}</span>
              </div>
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
              <h2 className="font-serif text-3xl">{language === 'fr' ? 'Équipements' : 'Amenities'}</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {amenities.map((item) => (
                  <span key={item} className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/75">{item}</span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#reservation" className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">
                  {language === 'fr' ? 'Réserver cette chambre' : 'Book this room'}
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
