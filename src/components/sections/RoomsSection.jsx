import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { formatPrice } from '../../lib/format'
import { pickLocalized } from '../../lib/i18n'
import SectionTitle from '../ui/SectionTitle'

export default function RoomsSection({
  rooms,
  onBookNow,
  search,
  setSearch,
  capacityFilter,
  setCapacityFilter,
  priceFilter,
  setPriceFilter,
  showFilters = true,
  title,
  text,
}) {
  const { language } = useLanguage()
  const [slides, setSlides] = useState({})

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const localizedName = pickLocalized(room.name, language).toLowerCase()
      const matchSearch = localizedName.includes(search.toLowerCase())
      const matchCapacity = capacityFilter === 'all' || room.capacity <= Number(capacityFilter)
      const matchPrice = priceFilter === 'all' || room.price <= Number(priceFilter)
      return matchSearch && matchCapacity && matchPrice
    })
  }, [rooms, search, capacityFilter, priceFilter, language])

  const moveSlide = (roomId, total, direction) => {
    setSlides((current) => {
      const currentIndex = current[roomId] ?? 0
      const nextIndex = (currentIndex + direction + total) % total
      return { ...current, [roomId]: nextIndex }
    })
  }

  return (
    <section id="chambres" className="section-wrap py-20">
      <SectionTitle
        eyebrow={language === 'fr' ? 'Chambres' : 'Rooms'}
        title={title || (language === 'fr' ? 'Des chambres adaptées à votre séjour' : 'Rooms adapted to your stay')}
        text={text || (language === 'fr'
          ? 'Retrouvez les principales catégories d’hébergement avec leurs tarifs indicatifs en franc CFA et les équipements essentiels.'
          : 'Explore the main accommodation categories with indicative XOF rates and essential amenities.')}
      />

      {showFilters ? (
        <div className="mt-8 grid gap-4 rounded-[28px] bg-white p-5 shadow-lg shadow-black/5 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <input placeholder={language === 'fr' ? 'Rechercher une chambre...' : 'Search a room...'} value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 rounded-2xl border border-black/10 px-4" />
          <select value={capacityFilter} onChange={(event) => setCapacityFilter(event.target.value)} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
            <option value="all">{language === 'fr' ? 'Toutes capacités' : 'All capacities'}</option>
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
            <option value="all">{language === 'fr' ? 'Tous les prix' : 'All prices'}</option>
            <option value="25000">25 000 XOF</option>
            <option value="40000">40 000 XOF</option>
            <option value="55000">55 000 XOF</option>
          </select>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room, roomIndex) => {
            const images = room.gallery?.length ? room.gallery : [room.image]
            const activeIndex = slides[room.id] ?? 0

            return (
              <motion.article
                key={room.id}
                className="overflow-hidden rounded-[28px] bg-white shadow-xl shadow-black/5"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: roomIndex * 0.06 }}
                whileHover={{ y: -10, rotateX: -5, rotateY: roomIndex % 2 === 0 ? 4 : -4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${room.id}-${activeIndex}`}
                      src={images[activeIndex]}
                      alt={pickLocalized(room.name, language)}
                      className="h-72 w-full object-cover"
                      initial={{ opacity: 0.45, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.45, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                    {room.featured ? <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-black">{language === 'fr' ? 'Coup de cœur' : 'Featured'}</span> : <span />}
                    {images.length > 1 ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => moveSlide(room.id, images.length, -1)} className="rounded-full bg-white/85 p-2 text-black shadow">
                          <ChevronLeft size={16} />
                        </button>
                        <button type="button" onClick={() => moveSlide(room.id, images.length, 1)} className="rounded-full bg-white/85 p-2 text-black shadow">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex gap-2 px-4 pb-4">
                    {images.map((_, index) => (
                      <span key={`${room.id}-dot-${index}`} className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/55'}`} />
                    ))}
                  </div>
                </div>

                {images.length > 1 ? (
                  <div className="grid grid-cols-4 gap-1 bg-[#f7eaea] p-1">
                    {images.slice(0, 4).map((image, index) => (
                      <button key={`${room.slug}-${index}`} type="button" onClick={() => setSlides((current) => ({ ...current, [room.id]: index }))} className={`overflow-hidden rounded-[10px] ${index === activeIndex ? 'ring-2 ring-[#7a2230]' : ''}`}>
                        <img src={image} alt={`${pickLocalized(room.name, language)} ${index + 1}`} className="h-16 w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-serif text-2xl">{pickLocalized(room.name, language)}</h3>
                      <p className="mt-1 text-sm text-black/60">{formatPrice(room.price, language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                    </div>
                    <div className="rounded-full bg-[#ebc9cf] px-3 py-1 text-xs font-medium text-black/75">{room.size}</div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-black/75">{pickLocalized(room.description, language)}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/75">
                    <span className="rounded-full border border-black/10 px-3 py-1">{room.capacity} {language === 'fr' ? 'pers.' : 'guests'}</span>
                    <span className="rounded-full border border-black/10 px-3 py-1">{images.length} {language === 'fr' ? 'photos' : 'photos'}</span>
                    {room.amenities.slice(0, 2).map((item) => (
                      <span key={pickLocalized(item, language)} className="rounded-full border border-black/10 px-3 py-1">{pickLocalized(item, language)}</span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={() => onBookNow(room)} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white hover:bg-[#54131d]">{language === 'fr' ? 'Réserver' : 'Book'}</button>
                    <Link to={`/rooms/${room.slug}`} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">{language === 'fr' ? 'Voir détails' : 'View details'}</Link>
                  </div>
                </div>
              </motion.article>
            )
          })
        ) : (
          <div className="col-span-full rounded-[28px] bg-white p-8 text-center shadow-lg shadow-black/5">
            <h3 className="font-serif text-3xl">{language === 'fr' ? 'Aucune chambre trouvée' : 'No room found'}</h3>
            <p className="mt-3 text-sm text-black/75">{language === 'fr' ? 'Essayez un autre filtre ou une autre recherche.' : 'Try a different filter or search.'}</p>
          </div>
        )}
      </div>
    </section>
  )
}
