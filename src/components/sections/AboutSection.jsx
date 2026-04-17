import { useLanguage } from '../../context/LanguageContext'
import SectionTitle from '../ui/SectionTitle'

export default function AboutSection() {
  const { language } = useLanguage()

  return (
    <section id="a-propos" className="section-wrap py-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
          <SectionTitle
            eyebrow={language === 'fr' ? 'À propos' : 'About'}
            title={language === 'fr' ? 'Un hôtel de quartier, pratique et accueillant' : 'A practical and welcoming neighborhood hotel'}
            text={language === 'fr'
              ? 'Le Morphée accueille les voyageurs, les familles et les groupes à la recherche d’une adresse simple, bien située et adaptée à plusieurs usages à Lomé.'
              : 'Le Morphée welcomes travelers, families and groups looking for a simple, well-located address in Lome.'}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            language === 'fr' ? 'Hébergement sur place' : 'On-site accommodation',
            language === 'fr' ? 'Restaurant' : 'Restaurant',
            language === 'fr' ? 'Salle des fêtes' : 'Event hall',
            language === 'fr' ? 'Séminaires et ateliers' : 'Seminars and workshops',
          ].map((item) => (
            <div key={item} className="rounded-[28px] border border-[#7a2230]/10 bg-[#ebc9cf]/40 p-6 text-sm font-medium text-black/80">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
