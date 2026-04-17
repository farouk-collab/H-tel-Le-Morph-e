import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { pickLocalized } from '../../lib/i18n'
import SectionTitle from '../ui/SectionTitle'

export default function TestimonialsSection({ testimonials }) {
  const [index, setIndex] = useState(0)
  const { language } = useLanguage()

  useEffect(() => {
    if (!testimonials.length) return undefined
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(id)
  }, [testimonials])

  if (!testimonials.length) return null

  return (
    <section id="avis" className="bg-[#ebc9cf] py-20">
      <div className="section-wrap">
        <SectionTitle
          eyebrow={language === 'fr' ? 'Avis clients' : 'Guest reviews'}
          title={language === 'fr' ? 'Une adresse appréciée à Lomé' : 'A well-regarded address in Lome'}
          text={language === 'fr'
            ? 'Les témoignages mettent en avant la qualité de l’accueil, la simplicité du séjour et le confort des chambres.'
            : 'Guest reviews highlight the welcome, the ease of the stay and the comfort of the rooms.'}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] bg-white p-8 shadow-xl shadow-black/5">
            <p className="text-sm uppercase tracking-[0.25em] text-black/50">{language === 'fr' ? 'Témoignage du moment' : 'Featured review'}</p>
            <p className="mt-6 font-serif text-3xl leading-snug">"{pickLocalized(testimonials[index].text, language)}"</p>
            <p className="mt-5 text-sm font-medium text-black/80">- {testimonials[index].name}</p>
            <p className="text-sm text-black/50">{pickLocalized(testimonials[index].role, language)}</p>
            <div className="mt-6 flex gap-2">
              {testimonials.map((item, itemIndex) => (
                <button key={item.id} type="button" onClick={() => setIndex(itemIndex)} className={`h-2.5 rounded-full transition ${itemIndex === index ? 'w-8 bg-black' : 'w-2.5 bg-black/25'}`} />
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            {[
              language === 'fr' ? 'Réservation simple et rapide' : 'Simple and fast booking',
              language === 'fr' ? 'Adresse bien située à Lomé' : 'Well-located address in Lome',
              language === 'fr' ? 'Informations claires et utiles' : 'Clear and useful information',
              language === 'fr' ? 'Confort pensé pour tous les séjours' : 'Comfort designed for every stay',
            ].map((item) => (
              <div key={item} className="rounded-[24px] bg-white p-5 shadow-lg shadow-black/5">
                <p className="text-sm text-black/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
