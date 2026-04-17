import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { SiteDataProvider } from './context/SiteDataContext'
import AdminPage from './pages/AdminPage'
import AccountPage from './pages/AccountPage'
import Home from './pages/Home'
import LegalNoticePage from './pages/LegalNoticePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import RoomDetail from './pages/RoomDetail'
import SpaceDetail from './pages/SpaceDetail'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SiteDataProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/mon-compte" element={<AccountPage />} />
            <Route path="/confidentialite" element={<PrivacyPolicyPage />} />
            <Route path="/mentions-legales" element={<LegalNoticePage />} />
            <Route path="/rooms/:slug" element={<RoomDetail />} />
            <Route path="/spaces/:slug" element={<SpaceDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </SiteDataProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
