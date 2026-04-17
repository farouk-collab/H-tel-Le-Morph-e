import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { pickLocalized } from '../../lib/i18n'

export default function OffersSection({ offers }) {
  const { language } = useLanguage()

  return (
    <section className="section-wrap py-16">
      <div className="grid gap-6 lg:grid-cols-3">
        {offers.map((offer) => (
          <article key={offer.id ?? offer.title} className="rounded-[28px] bg-[#ebc9cf] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">{language === 'fr' ? 'À la une' : 'Highlights'}</p>
            <h3 className="mt-3 font-serif text-3xl">{pickLocalized(offer.title, language)}</h3>
            <p className="mt-3 text-sm leading-7 text-black/75">{pickLocalized(offer.subtitle, language)}</p>
            <Link to="/#chambres" className="mt-5 inline-flex rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white hover:bg-[#54131d]">
              {language === 'fr' ? 'Découvrir' : 'Discover'}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
