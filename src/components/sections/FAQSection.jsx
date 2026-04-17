import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { faqs } from '../../data/faqs'
import { pickLocalized } from '../../lib/i18n'
import SectionTitle from '../ui/SectionTitle'

export default function FAQSection() {
  const [open, setOpen] = useState(0)
  const { language } = useLanguage()

  return (
    <section className="section-wrap py-10">
      <SectionTitle
        eyebrow="FAQ"
        title={language === 'fr' ? 'Questions fréquentes' : 'Frequently asked questions'}
        text={language === 'fr'
          ? 'Une petite FAQ aide à rassurer le visiteur sans qu il ait besoin de contacter l’Hôtel.'
          : 'A compact FAQ reassures visitors without requiring them to contact the hotel first.'}
      />

      <div className="mt-8 grid gap-4">
        {faqs.map((item, itemIndex) => (
          <button
            key={pickLocalized(item.q, language)}
            type="button"
            onClick={() => setOpen(open === itemIndex ? -1 : itemIndex)}
            className="rounded-[24px] bg-white p-6 text-left shadow-lg shadow-black/5"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-medium">{pickLocalized(item.q, language)}</h3>
              <span className="text-xl">{open === itemIndex ? '-' : '+'}</span>
            </div>
            {open === itemIndex ? <p className="pt-4 text-sm leading-7 text-black/75">{pickLocalized(item.a, language)}</p> : null}
          </button>
        ))}
      </div>
    </section>
  )
}

