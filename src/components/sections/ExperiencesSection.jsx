import { useLanguage } from '../../context/LanguageContext'
import { experiences } from '../../data/services'
import { pickLocalized } from '../../lib/i18n'
import SectionTitle from '../ui/SectionTitle'

export default function ExperiencesSection() {
  const { language } = useLanguage()

  return (
    <section id="experiences" className="section-wrap py-20">
      <SectionTitle
        eyebrow={language === 'fr' ? 'Expériences' : 'Experiences'}
        title={language === 'fr' ? 'Des usages au-delà de la nuit d’hôtel' : 'More than a room for the night'}
        text={language === 'fr'
          ? 'Le site présente aussi les usages événementiels et professionnels du lieu, pour mieux valoriser l’activité réelle de l’établissement.'
          : 'The website also highlights event and business uses of the venue to better reflect the property activity.'}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {experiences.map((experience) => (
          <article key={pickLocalized(experience.title, language)} className="rounded-[28px] bg-white p-6 shadow-lg shadow-black/5">
            <h3 className="font-serif text-2xl">{pickLocalized(experience.title, language)}</h3>
            <p className="mt-4 text-sm leading-7 text-black/75">{pickLocalized(experience.text, language)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
