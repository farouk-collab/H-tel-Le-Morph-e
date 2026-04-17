import { Clock3, Coffee, CreditCard, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionTitle from '../ui/SectionTitle'

export default function StayInfoSection() {
  const { language } = useLanguage()
  const items = [
    {
      icon: Clock3,
      title: language === 'fr' ? 'Check-in / Check-out' : 'Check-in / Check-out',
      text: language === 'fr' ? 'Arrivee a partir de 15h, depart avant 11h.' : 'Arrival from 3 PM, departure before 11 AM.',
    },
    {
      icon: Coffee,
      title: language === 'fr' ? 'petit-déjeuner' : 'Breakfast',
      text: language === 'fr' ? 'Peut etre ajoute a la réservation selon la chambre.' : 'Can be added to the booking depending on the room.',
    },
    {
      icon: ShieldCheck,
      title: language === 'fr' ? 'Annulation' : 'Cancellation',
      text: language === 'fr' ? 'Politique a confirmer avec l equipe selon le type de séjour.' : 'Policy to be confirmed with the team depending on the stay type.',
    },
    {
      icon: CreditCard,
      title: language === 'fr' ? 'Paiements' : 'Payments',
      text: language === 'fr' ? 'XOF, Flooz, TMoney, Mobile Money, virement ou carte selon disponibilité.' : 'XOF, Flooz, TMoney, Mobile Money, transfer or card depending on availability.',
    },
  ]

  return (
    <section className="section-wrap py-20">
      <SectionTitle
        eyebrow={language === 'fr' ? 'informations utiles' : 'Useful information'}
        title={language === 'fr' ? 'Check-in, petit-déjeuner, Annulation et Paiements' : 'Check-in, breakfast, cancellation and payments'}
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="rounded-[24px] bg-white p-6 shadow-lg shadow-black/5">
              <Icon className="text-[#7a2230]" size={22} />
              <h3 className="mt-4 font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/75">{item.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
