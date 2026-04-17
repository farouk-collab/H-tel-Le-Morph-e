import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteData } from '../../context/SiteDataContext'

function navClass({ isActive }) {
  return `text-sm transition ${isActive ? 'text-black' : 'text-black/75 hover:text-black'}`
}

export default function Navbar({ onBookNow = () => {}, isAdminAuthenticated = false, onLogout = () => {} }) {
  const [open, setOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const { user } = useSiteData()
  const location = useLocation()

  const links = [
    { label: language === 'fr' ? 'Accueil' : 'Home', href: '/' },
    { label: language === 'fr' ? 'Chambres' : 'Rooms', href: '/#chambres' },
    { label: language === 'fr' ? 'Expériences' : 'Experiences', href: '/#experiences' },
    { label: language === 'fr' ? 'Galerie' : 'Gallery', href: '/#galerie' },
    { label: language === 'fr' ? 'Contact' : 'Contact', href: '/#contact' },
    { label: language === 'fr' ? 'Mon compte' : 'My account', href: '/mon-compte' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7eaea]/90 backdrop-blur">
      <div className="section-wrap flex items-center justify-between py-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img src="/images/logo-hotel-le-morphee.jpg" alt="Logo Hôtel Le Morphée" className="h-12 w-12 rounded-full bg-white object-cover shadow-sm" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/50">Hôtel</p>
            <h1 className="font-serif text-2xl font-semibold">Le Morphée</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            link.href.startsWith('/#') ? (
              <a key={link.href} href={link.href} className="text-sm text-black/75 transition hover:text-black">
                {link.label}
              </a>
            ) : (
              <NavLink key={link.href} to={link.href} className={navClass}>
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1 sm:flex">
            {['fr', 'en'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase ${language === item ? 'bg-[#7a2230] text-white' : 'text-black/65'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {isAdminAuthenticated && location.pathname === '/admin' ? (
            <button type="button" onClick={onLogout} className="hidden rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-black/80 sm:inline-flex">
              {language === 'fr' ? 'Déconnexion' : 'Logout'}
            </button>
          ) : null}

          <button type="button" onClick={onBookNow} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white hover:bg-[#54131d]">
            {language === 'fr' ? 'Réserver' : 'Book'}
          </button>

          <button type="button" className="inline-flex rounded-full border border-black/10 px-3 py-2 text-sm md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-[#f7eaea] md:hidden">
          <div className="section-wrap grid gap-1 py-4">
            {links.map((link) => (
              link.href.startsWith('/#') ? (
                <a key={link.href} href={link.href} className="rounded-2xl px-3 py-3 text-sm text-black/80 transition hover:bg-[#7a2230]/5" onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className="rounded-2xl px-3 py-3 text-sm text-black/80 transition hover:bg-[#7a2230]/5" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              )
            ))}
            <div className="mt-2 flex gap-2 px-3">
              {['fr', 'en'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLanguage(item)
                    setOpen(false)
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase ${language === item ? 'bg-[#7a2230] text-white' : 'bg-white text-black/65'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
