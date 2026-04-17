import { useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteData } from '../../context/SiteDataContext'
import StickyActions from '../common/StickyActions'
import Footer from './Footer'
import Navbar from './Navbar'

export default function SiteLayout() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { adminSession, logout, addNewsletter } = useSiteData()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const bookNow = useMemo(
    () => () => {
      if (window.location.pathname !== '/') {
        navigate('/#réservation')
        return
      }

      document.getElementById('réservation')?.scrollIntoView({ behavior: 'smooth' })
    },
    [navigate],
  )

  const handleNewsletterSubmit = (event) => {
    event.preventDefault()

    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterMessage(language === 'fr' ? 'Entrez un email valide.' : 'Please enter a valid email.')
      return
    }

    addNewsletter(newsletterEmail.trim())
    setNewsletterEmail('')
    setNewsletterMessage(language === 'fr' ? 'Email enregistre localement.' : 'Email saved locally.')
  }

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={bookNow} isAdminAuthenticated={!!adminSession} onLogout={logout} />
      <Outlet />
      <Footer
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        onNewsletterSubmit={handleNewsletterSubmit}
        newsletterMessage={newsletterMessage}
      />
      <StickyActions />
    </div>
  )
}
