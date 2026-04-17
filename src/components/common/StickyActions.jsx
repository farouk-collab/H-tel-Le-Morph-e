import { MessageCircleMore } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { buildWhatsAppLink } from '../../lib/format'

const phone = '+22892727278'

export default function StickyActions() {
  const { language } = useLanguage()
  const réserveLabel = language === 'fr' ? 'réserver' : 'Book'
  const whatsappLabel = language === 'fr' ? 'WhatsApp' : 'WhatsApp'

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href="#réservation"
        className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-[#7a2230]/25"
      >
        {réserveLabel}
      </a>
      <a
        href={buildWhatsAppLink(phone, language === 'fr' ? 'Bonjour, je souhaite réserver a l Hôtel Le Morphée.' : 'Hello, I would like to book at Hôtel Le Morphée.')}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#7a2230] shadow-2xl shadow-black/10"
      >
        <MessageCircleMore size={18} />
        {whatsappLabel}
      </a>
    </div>
  )
}
