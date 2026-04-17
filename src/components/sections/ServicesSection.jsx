import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteData } from '../../context/SiteDataContext'
import { pickLocalized } from '../../lib/i18n'
import SectionTitle from '../ui/SectionTitle'

export default function ServicesSection() {
  const { language } = useLanguage()
  const { spaces } = useSiteData()
  const [slides, setSlides] = useState({})

  const moveSlide = (serviceTitle, total, direction) => {
    setSlides((current) => {
      const currentIndex = current[serviceTitle] ?? 0
      const nextIndex = (currentIndex + direction + total) % total
      return { ...current, [serviceTitle]: nextIndex }
    })
  }

  return (
    <section id="services" className="bg-[#7a2230] py-20 text-white">
      <div className="section-wrap">
        <SectionTitle
          eyebrow={language === 'fr' ? 'Services' : 'Services'}
          title={language === 'fr' ? 'Une expérience complète à Lomé' : 'A complete experience in Lome'}
          text={language === 'fr'
            ? 'Au-delà de la chambre, Le Morphée propose des espaces avec plus de présence visuelle pour les séjours, les réceptions et les moments à partager.'
            : 'Beyond the room itself, Le Morphée offers spaces with stronger visual presence for stays, receptions and shared moments.'}
        />

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          {spaces.map((service, index) => {
            const title = pickLocalized(service.title, language)
            const gallery = service.gallery?.length ? service.gallery : [service.image]
            const activeIndex = slides[title] ?? 0
            const activeImage = gallery[activeIndex]

            return (
              <motion.article
                key={service.id || title}
                className={`overflow-hidden rounded-[30px] border border-white/15 bg-gradient-to-br ${service.accent || 'from-[#f7d7de] to-[#7a2230]'} p-[1px] shadow-2xl shadow-black/20 ${index === 0 ? 'xl:row-span-2' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8, rotateX: -5, rotateY: index % 2 === 0 ? 4 : -4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="rounded-[29px] bg-[#5f1a28]">
                  <div className="relative overflow-hidden rounded-[29px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${title}-${activeIndex}`}
                        src={activeImage}
                        alt={title}
                        className={`w-full object-cover ${index === 0 ? 'h-[420px] md:h-[520px]' : 'h-[320px]'}`}
                        initial={{ opacity: 0.45, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.45, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-black">
                        {language === 'fr' ? 'Espace' : 'Space'}
                      </span>
                      {gallery.length > 1 ? (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveSlide(title, gallery.length, -1)} className="rounded-full bg-white/90 p-2 text-black shadow">
                            <ChevronLeft size={16} />
                          </button>
                          <button type="button" onClick={() => moveSlide(title, gallery.length, 1)} className="rounded-full bg-white/90 p-2 text-black shadow">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="font-serif text-3xl md:text-4xl">{title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">{pickLocalized(service.text, language)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3">
                    {gallery.map((image, thumbIndex) => (
                      <button
                        key={`${title}-thumb-${thumbIndex}`}
                        type="button"
                        onClick={() => setSlides((current) => ({ ...current, [title]: thumbIndex }))}
                        className={`overflow-hidden rounded-[18px] border ${thumbIndex === activeIndex ? 'border-white ring-2 ring-white/60' : 'border-white/10 opacity-75'}`}
                      >
                        <img src={image} alt={`${title} ${thumbIndex + 1}`} className="h-20 w-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pb-4">
                    <Link to={`/spaces/${service.slug}`} className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#7a2230]">
                      {language === 'fr' ? 'Voir détails' : 'View details'}
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
