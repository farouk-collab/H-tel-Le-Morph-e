import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { gallery } from '../../data/gallery'
import SectionTitle from '../ui/SectionTitle'

export default function GallerySection() {
  const [selected, setSelected] = useState(null)
  const [category, setCategory] = useState('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const { language } = useLanguage()

  const categories = {
    all: language === 'fr' ? 'Tout' : 'All',
    rooms: language === 'fr' ? 'Chambres' : 'Rooms',
    events: language === 'fr' ? 'Événements' : 'Events',
    reception: language === 'fr' ? 'Réception' : 'Reception',
    restaurant: language === 'fr' ? 'Restaurant' : 'Restaurant',
    terrace: language === 'fr' ? 'Terrasse' : 'Terrace',
  }

  const items = useMemo(() => gallery.filter((item) => category === 'all' || item.category === category), [category])

  const goTo = (direction) => {
    if (!items.length) return
    setActiveIndex((current) => (current + direction + items.length) % items.length)
  }

  const activeImage = items[activeIndex]?.image
  const prevImage = items[(activeIndex - 1 + items.length) % items.length]?.image
  const nextImage = items[(activeIndex + 1) % items.length]?.image

  return (
    <section id="galerie" className="section-wrap py-20">
      <SectionTitle
        eyebrow={language === 'fr' ? 'Galerie' : 'Gallery'}
        title={language === 'fr' ? 'L’univers visuel du Morphée' : 'The visual world of Le Morphée'}
        text={language === 'fr'
          ? 'Une galerie filtrable aide à montrer les chambres, les espaces de réception et l’ambiance générale du lieu.'
          : 'A filterable gallery helps present the rooms, reception spaces and overall atmosphere of the place.'}
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setCategory(key)
              setActiveIndex(0)
            }}
            className={`rounded-full px-4 py-2 text-sm ${category === key ? 'bg-[#7a2230] text-white' : 'bg-white text-black/70'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length ? (
        <div className="mt-10 rounded-[32px] bg-[linear-gradient(135deg,#fff7f7,#f0d9dd)] p-4 shadow-2xl shadow-black/5">
          <div className="relative overflow-hidden rounded-[28px] bg-[#2d1118] px-4 py-8 sm:px-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#2d1118] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#2d1118] to-transparent" />

            <div className="relative flex items-center justify-center gap-4">
              <button type="button" onClick={() => goTo(-1)} className="z-10 rounded-full bg-white/90 p-3 text-black shadow-xl">
                <ChevronLeft size={18} />
              </button>

              <div className="hidden w-48 shrink-0 rounded-[24px] opacity-60 blur-[1px] md:block" style={{ transform: 'perspective(1000px) rotateY(28deg) rotateX(8deg)' }}>
                {prevImage ? <img src={prevImage} alt="Previous" className="h-72 w-full rounded-[24px] object-cover" /> : null}
              </div>

              <AnimatePresence mode="wait">
                <motion.button
                  key={`${category}-${activeIndex}`}
                  type="button"
                  onClick={() => setSelected(activeImage)}
                  className="relative w-full max-w-3xl overflow-hidden rounded-[28px]"
                  initial={{ opacity: 0.5, y: 30, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0.5, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ rotateX: -4, rotateY: 4, y: -6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img src={activeImage} alt={`Galerie ${activeIndex + 1}`} className="h-[420px] w-full object-cover sm:h-[520px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.button>
              </AnimatePresence>

              <div className="hidden w-48 shrink-0 rounded-[24px] opacity-60 blur-[1px] md:block" style={{ transform: 'perspective(1000px) rotateY(-28deg) rotateX(8deg)' }}>
                {nextImage ? <img src={nextImage} alt="Next" className="h-72 w-full rounded-[24px] object-cover" /> : null}
              </div>

              <button type="button" onClick={() => goTo(1)} className="z-10 rounded-full bg-white/90 p-3 text-black shadow-xl">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="relative mt-6 flex flex-wrap justify-center gap-2">
              {items.map((item, index) => (
                <button
                  key={`${item.image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden rounded-2xl border ${index === activeIndex ? 'border-white ring-2 ring-white/60' : 'border-white/15 opacity-70'}`}
                >
                  <img src={item.image} alt={`Miniature ${index + 1}`} className="h-14 w-20 object-cover sm:h-16 sm:w-24" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 8).map((item, index) => (
          <motion.button
            key={`${item.image}-${index}`}
            type="button"
            onClick={() => {
              setActiveIndex(index)
              setSelected(item.image)
            }}
            className={`overflow-hidden rounded-[24px] text-left ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
            whileHover={{ y: -6, rotateX: -4, rotateY: index % 2 === 0 ? 4 : -4 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img src={item.image} alt={`Galerie ${index + 1}`} className="h-full min-h-[220px] w-full object-cover transition duration-500 hover:scale-105" />
          </motion.button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4">
          <button type="button" className="absolute right-5 top-5 rounded-full bg-white/15 px-4 py-2 text-white" onClick={() => setSelected(null)}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
          <img src={selected} alt="Galerie" className="max-h-[85vh] w-full max-w-5xl rounded-[28px] object-cover" />
        </div>
      ) : null}
    </section>
  )
}
