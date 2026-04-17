import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

export default function Footer({
  newsletterEmail = '',
  setNewsletterEmail = () => {},
  newsletterConsent = false,
  setNewsletterConsent = () => {},
  onNewsletterSubmit = (event) => event.preventDefault(),
  newsletterMessage = '',
}) {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="section-wrap grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/logo-hotel-le-morphee.jpg" alt="Logo Hôtel Le Morphée" className="h-14 w-14 rounded-full bg-white object-cover shadow-sm" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-black/50">Hôtel Le Morphée</p>
              <p className="text-sm text-black/60">Lomé-Totsi</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-black/75">
            {language === 'fr'
              ? 'Une adresse à Lomé-Totsi pour les séjours, les réunions professionnelles et les événements dans un cadre simple et accueillant.'
              : 'An address in Lomé-Totsi for stays, professional meetings and events in a simple and welcoming setting.'}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">{language === 'fr' ? 'Navigation' : 'Navigation'}</p>
          <div className="mt-3 grid gap-2 text-sm text-black/75">
            <Link to="/">{language === 'fr' ? 'Accueil' : 'Home'}</Link>
            <a href="/#chambres">{language === 'fr' ? 'Chambres' : 'Rooms'}</a>
            <a href="/#contact">{language === 'fr' ? 'Contact' : 'Contact'}</a>
            <Link to="/mon-compte">{language === 'fr' ? 'Mon compte' : 'My account'}</Link>
            <Link to="/confidentialite">{language === 'fr' ? 'Confidentialité' : 'Privacy'}</Link>
            <Link to="/mentions-legales">{language === 'fr' ? 'Mentions légales' : 'Legal notice'}</Link>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-black/75">
          <div className="flex items-start gap-3"><MapPin size={16} className="mt-1 text-[#7a2230]" /><span>Rue 168 TOT, Lomé-Totsi, deuxième von à gauche après l’Église Catholique</span></div>
          <div className="flex items-start gap-3"><Phone size={16} className="mt-1 text-[#7a2230]" /><span>(+228) 92 72 72 78 / 22 25 77 60 / 93 07 08 61</span></div>
          <div className="flex items-start gap-3"><Mail size={16} className="mt-1 text-[#7a2230]" /><span>lemorphee28@gmail.com / hotellemorphee8@gmail.com</span></div>
        </div>

        <div>
          <p className="text-sm font-semibold">{language === 'fr' ? 'Newsletter' : 'Newsletter'}</p>
          <form className="mt-3 grid gap-3" onSubmit={onNewsletterSubmit}>
            <div className="flex gap-2">
              <input
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                className="h-12 w-full rounded-full border border-black/10 px-4"
              />
              <button type="submit" className="rounded-full bg-[#7a2230] px-5 text-white hover:bg-[#54131d]">OK</button>
            </div>
            <label className="flex items-start gap-2 text-xs leading-6 text-black/65">
              <input type="checkbox" checked={newsletterConsent} onChange={(event) => setNewsletterConsent(event.target.checked)} className="mt-1" />
              <span>J’accepte d’être contacté par email au sujet des actualités et offres de l’hôtel.</span>
            </label>
          </form>
          {newsletterMessage ? <p className="mt-3 text-sm text-[#7a2230]">{newsletterMessage}</p> : null}
        </div>
      </div>
    </footer>
  )
}
