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
  const { adminSession, logout, submitNewsletter } = useSiteData()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterConsent, setNewsletterConsent] = useState(false)
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

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()

    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterMessage(language === 'fr' ? 'Entrez un email valide.' : 'Please enter a valid email.')
      return
    }

    if (!newsletterConsent) {
      setNewsletterMessage(language === 'fr' ? 'Merci de confirmer votre accord.' : 'Please confirm your consent.')
      return
    }

    try {
      const result = await submitNewsletter(newsletterEmail.trim())
      setNewsletterEmail('')
      setNewsletterConsent(false)
      setNewsletterMessage(result.created
        ? (language === 'fr' ? 'Inscription enregistree.' : 'Subscription saved.')
        : (language === 'fr' ? 'Cet email est deja inscrit.' : 'This email is already subscribed.'))
    } catch (error) {
      setNewsletterMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={bookNow} isAdminAuthenticated={!!adminSession} onLogout={logout} />
      <Outlet />
      <Footer
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterConsent={newsletterConsent}
        setNewsletterConsent={setNewsletterConsent}
        onNewsletterSubmit={handleNewsletterSubmit}
        newsletterMessage={newsletterMessage}
      />
      <StickyActions />
    </div>
  )
}
