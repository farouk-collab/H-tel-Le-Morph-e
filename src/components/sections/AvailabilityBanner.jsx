import { useLanguage } from '../../context/LanguageContext'

export default function AvailabilityBanner({ result }) {
  const { language } = useLanguage()

  if (!result) return null

  return (
    <section className="section-wrap pt-10">
      <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-xl shadow-black/5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-black/50">{language === 'fr' ? 'Disponibilité' : 'Availability'}</p>
            <h3 className="mt-2 font-serif text-3xl">{result.title}</h3>
            <p className="mt-2 text-sm leading-7 text-black/75">{result.text}</p>
          </div>
          <div className="rounded-3xl bg-[#f7eaea] px-5 py-4 text-sm text-black/80">
            <div><strong>{language === 'fr' ? 'Dates' : 'Dates'} :</strong> {result.checkIn || '-'} {language === 'fr' ? 'au' : 'to'} {result.checkOut || '-'}</div>
            <div className="mt-1"><strong>{language === 'fr' ? 'Voyageurs' : 'Guests'} :</strong> {result.guests}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
