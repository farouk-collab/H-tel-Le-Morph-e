import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const labels = {
  fr: 'FR',
  en: 'EN',
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('hotel_language') || 'fr')

  useEffect(() => {
    localStorage.setItem('hotel_language', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      labels,
      toggleLanguage: () => setLanguage((current) => (current === 'fr' ? 'en' : 'fr')),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}
