import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'

export default function AdminLoginCard() {
  const { login, loading } = useSiteData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await login(email, password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setError('')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff8f6_0%,#f7eaea_38%,#efd6db_100%)] px-4 py-10 text-[#2f1b1f] sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_520px]">
        <section className="rounded-[36px] border border-[#7a2230]/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.86),rgba(248,232,235,0.78))] p-8 shadow-[0_35px_120px_rgba(122,34,48,0.14)] backdrop-blur xl:p-12">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#7a2230]/12 bg-white/70 px-4 py-2 text-sm text-[#7a2230]">
            <img src="/images/logo-hotel-le-morphee.jpg" alt="Logo Hotel Le Morphee" className="h-7 w-7 rounded-full object-cover" />
            Espace administration independant
          </div>
          <h1 className="mt-8 max-w-2xl font-serif text-5xl leading-tight text-[#2f1b1f] xl:text-6xl">
            Un back-office separe du site client.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#6d4a51]">
            Gerez les chambres, les salles, les reservations, les paiements et les messages depuis une interface dediee, pensee comme un veritable cockpit metier.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Reservations', 'Suivi des demandes et statuts'],
              ['Paiements', 'Retour PayGate et historique'],
              ['Contenu', 'Chambres, salles et temoignages'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-[#7a2230]/10 bg-white/72 p-4">
                <p className="text-sm font-semibold text-[#341d22]">{title}</p>
                <p className="mt-2 text-xs leading-6 text-[#7a5c61]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[36px] border border-[#7a2230]/12 bg-[linear-gradient(180deg,#fffdfc_0%,#fff7f5_100%)] p-8 text-[#2f1b1f] shadow-[0_35px_120px_rgba(122,34,48,0.12)] xl:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a07a82]">Back-office</p>
          <h2 className="mt-3 font-serif text-4xl">Connexion admin</h2>
          <p className="mt-3 text-sm leading-7 text-[#7a5c61]">Compte initial : <span className="font-medium text-[#7a2230]">hotellemorphee8@gmail.com</span> / <span className="font-medium text-[#7a2230]">admin123</span></p>
          <div className="mt-8 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5c3b42]">Email</label>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 outline-none transition focus:border-[#7a2230] focus:bg-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5c3b42]">Mot de passe</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 outline-none transition focus:border-[#7a2230] focus:bg-white" />
            </div>
            {error ? <div className="rounded-2xl border border-[#f3c8cf] bg-[#fff1f3] px-4 py-3 text-sm text-[#b4233c]">{error}</div> : null}
            <button type="submit" disabled={loading} className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824] disabled:opacity-60">
              {loading ? 'Connexion...' : 'Acceder au dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
