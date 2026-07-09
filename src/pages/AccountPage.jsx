import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useSiteData } from '../context/SiteDataContext'
import { apiGet } from '../lib/api'

function AuthCard() {
  const navigate = useNavigate()
  const { login, register, loading } = useSiteData()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isLogin = mode === 'login'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    setMessage(isLogin ? 'Connexion reussie.' : 'Compte cree avec succes.')
    navigate('/mon-compte')
  }

  return (
    <section className="section-wrap py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-[#7a2230] p-8 text-white shadow-2xl shadow-black/10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">Compte client</p>
          <h1 className="mt-4 font-serif text-5xl">Mon compte</h1>
          <p className="mt-5 text-sm leading-8 text-white/80">
            Connectez-vous pour retrouver vos reservations de chambres et de salles, suivre vos paiements Flooz ou TMoney, et finaliser vos demandes dans un espace plus securise.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm leading-7 text-white/85">
            <p>Vos donnees servent a gerer vos reservations et paiements.</p>
            <p className="mt-2">Consultez la <Link to="/confidentialite" className="underline">politique de confidentialite</Link> et les <Link to="/mentions-legales" className="underline">mentions legales</Link>.</p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-2xl shadow-black/10">
          <div className="flex gap-3 rounded-full border border-black/10 bg-[#fcf4f5] p-1">
            <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${isLogin ? 'bg-[#7a2230] text-white' : 'text-black/65'}`}>
              Connexion
            </button>
            <button type="button" onClick={() => setMode('register')} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${!isLogin ? 'bg-[#7a2230] text-white' : 'text-black/65'}`}>
              Creer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {!isLogin ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-black/80">Nom complet</label>
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
              </div>
            ) : null}
            <div>
              <label className="mb-2 block text-sm font-medium text-black/80">Email</label>
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-black/80">Mot de passe</label>
              <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="h-12 w-full rounded-2xl border border-black/10 px-4" />
            </div>
            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
            {message ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
            <button type="submit" disabled={loading} className="rounded-2xl bg-[#7a2230] py-3 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? 'Veuillez patienter...' : isLogin ? 'Se connecter' : 'Creer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function PaymentButton({ reservation, provider }) {
  const { initiatePayment } = useSiteData()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setFeedback('')

    try {
      const result = await initiatePayment({ reservationId: reservation.id, provider, phone: reservation.phone || '', amount: reservation.amount })
      setFeedback(result.mode === 'mock' ? `Paiement ${provider} simule avec succes.` : `Paiement ${provider} initialise. Finalisez-le sur la page PayGate qui va s'ouvrir.`)
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={handleClick} disabled={loading} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
        {loading ? 'Traitement...' : `Payer avec ${provider === 'flooz' ? 'Flooz' : 'TMoney'}`}
      </button>
      {feedback ? <p className="text-xs text-black/55">{feedback}</p> : null}
    </div>
  )
}

function CancelReservationButton({ reservation }) {
  const { cancelReservation } = useSiteData()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleCancel = async () => {
    setLoading(true)
    setFeedback('')

    try {
      await cancelReservation(reservation.id)
      setFeedback('Reservation annulee.')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (reservation.status === 'canceled') {
    return <p className="text-xs text-red-600">Reservation annulee.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={handleCancel} disabled={loading} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-60">
        {loading ? 'Annulation...' : 'Annuler la reservation'}
      </button>
      {feedback ? <p className="text-xs text-black/55">{feedback}</p> : null}
    </div>
  )
}

function reservationTitle(reservation) {
  return reservation.type === 'space' ? reservation.spaceName || 'Salle' : reservation.roomName || 'Chambre'
}

function reservationSubtitle(reservation) {
  if (reservation.type === 'space') {
    return reservation.eventDate ? `Evenement prevu le ${reservation.eventDate}` : 'Demande de salle en attente de date'
  }

  return `Du ${reservation.checkIn || '...'} au ${reservation.checkOut || '...'}`
}

function PaymentReturnBanner({ paymentLookup, onClear }) {
  if (!paymentLookup.reference) return null

  const status = paymentLookup.payment?.status || 'pending'
  const tone = status === 'completed'
    ? 'bg-green-50 text-green-700'
    : status === 'failed' || status === 'canceled'
      ? 'bg-red-50 text-red-700'
      : 'bg-[#fcf4f5] text-[#7a2230]'

  const title = status === 'completed'
    ? 'Paiement confirme'
    : status === 'failed' || status === 'canceled'
      ? 'Paiement non finalise'
      : 'Paiement en attente'

  const message = paymentLookup.loading
    ? 'Verification du paiement en cours...'
    : paymentLookup.error
      ? paymentLookup.error
      : status === 'completed'
        ? 'Votre paiement a bien ete recu. La reservation correspondante a ete mise a jour.'
        : status === 'failed' || status === 'canceled'
          ? "Le paiement n'a pas abouti. Vous pouvez relancer la tentative depuis votre espace client."
          : 'Le paiement a ete initialise. Patientez quelques instants puis actualisez si besoin.'

  return (
    <div className={`mt-8 rounded-[24px] px-5 py-4 text-sm leading-7 ${tone}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em]">Retour PayGate</p>
          <p className="mt-2 font-semibold">{title}</p>
          <p className="mt-2">{message}</p>
          <p className="mt-2 text-xs">Reference : {paymentLookup.reference}</p>
        </div>
        <button type="button" onClick={onClear} className="rounded-full border border-current/20 px-4 py-2 text-xs font-semibold">
          Fermer
        </button>
      </div>
    </div>
  )
}

function AccountDashboard() {
  const { user, reservations, payments, logout, authToken, refreshAccountData } = useSiteData()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const pendingReservations = useMemo(() => reservations.filter((item) => item.paymentStatus !== 'completed' && Number(item.amount || 0) > 0), [reservations])
  const [paymentLookup, setPaymentLookup] = useState({
    reference: searchParams.get('payment') || '',
    loading: false,
    error: '',
    payment: null,
    reservation: null,
  })

  useEffect(() => {
    const reference = searchParams.get('payment') || ''

    if (!reference || !authToken) {
      setPaymentLookup((current) => ({ ...current, reference }))
      return
    }

    let active = true
    setPaymentLookup({ reference, loading: true, error: '', payment: null, reservation: null })

    Promise.all([
      apiGet(`/api/me/payments/${encodeURIComponent(reference)}`, authToken),
      refreshAccountData(),
    ])
      .then(([data]) => {
        if (!active) return
        setPaymentLookup({
          reference,
          loading: false,
          error: '',
          payment: data.payment || null,
          reservation: data.reservation || null,
        })
      })
      .catch((error) => {
        if (!active) return
        setPaymentLookup({
          reference,
          loading: false,
          error: error.message || 'Impossible de verifier ce paiement pour le moment.',
          payment: null,
          reservation: null,
        })
      })

    return () => {
      active = false
    }
  }, [authToken, searchParams])

  const clearPaymentFeedback = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('payment')
    setSearchParams(nextParams, { replace: true })
    setPaymentLookup({ reference: '', loading: false, error: '', payment: null, reservation: null })
  }

  return (
    <main className="section-wrap py-12">
      <div className="flex flex-col gap-4 rounded-[32px] bg-white p-8 shadow-xl shadow-black/5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-black/45">Espace client</p>
          <h1 className="mt-3 font-serif text-5xl">Bonjour {user?.name?.split(' ')[0] || 'client'}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70">
            Retrouvez ici vos reservations de chambres et de salles, vos references de paiement et le suivi de vos demandes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate('/')} className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black/80">Retour au site</button>
          <button type="button" onClick={logout} className="rounded-full bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white">Deconnexion</button>
        </div>
      </div>

      <PaymentReturnBanner paymentLookup={paymentLookup} onClear={clearPaymentFeedback} />

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
          <h2 className="font-serif text-3xl">Reservations</h2>
          <div className="mt-6 grid gap-4">
            {reservations.length ? reservations.map((reservation) => {
              const canPay = reservation.status !== 'canceled' && reservation.paymentStatus !== 'completed' && Number(reservation.amount || 0) > 0

              return (
                <article key={reservation.id} className="rounded-[24px] border border-black/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-black/45">{reservation.type === 'space' ? 'Salle / espace' : 'Chambre'}</p>
                      <h3 className="mt-2 font-serif text-2xl">{reservationTitle(reservation)}</h3>
                      <p className="mt-1 text-sm text-black/60">{reservationSubtitle(reservation)}</p>
                    </div>
                    <span className="rounded-full bg-[#fcf4f5] px-3 py-1 text-xs font-semibold text-[#7a2230]">{reservation.status || 'pending'}</span>
                  </div>
                  <p className="mt-4 text-sm text-black/70">Paiement : {reservation.paymentStatus || 'en attente'}</p>
                  {Number(reservation.amount || 0) > 0 ? <p className="mt-1 text-sm text-black/70">Montant : {Number(reservation.amount || 0).toLocaleString('fr-FR')} XOF</p> : null}
                  {reservation.note ? <p className="mt-3 text-sm leading-7 text-black/65">{reservation.note}</p> : null}
                  {canPay ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <PaymentButton reservation={reservation} provider="flooz" />
                      <PaymentButton reservation={reservation} provider="tmoney" />
                      <CancelReservationButton reservation={reservation} />
                    </div>
                  ) : reservation.status === 'canceled' ? (
                    <div className="mt-4"><CancelReservationButton reservation={reservation} /></div>
                  ) : reservation.paymentStatus !== 'completed' ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <CancelReservationButton reservation={reservation} />
                      {reservation.type === 'space' ? <p className="self-center text-xs text-black/55">Aucun montant n'a encore ete defini pour cette salle.</p> : null}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-black/55">Reservation payee : l'annulation automatique est desactivee. Contactez l'hotel.</p>
                  )}
                </article>
              )
            }) : <p className="text-sm text-black/55">Aucune reservation enregistree pour le moment.</p>}
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-xl shadow-black/5">
          <h2 className="font-serif text-3xl">Historique des paiements</h2>
          <div className="mt-6 grid gap-4">
            {payments.length ? payments.map((payment) => (
              <article key={payment.id} className="rounded-[24px] border border-black/10 p-5 text-sm leading-7 text-black/75">
                <p><strong>Reference :</strong> {payment.reference}</p>
                <p><strong>Montant :</strong> {Number(payment.amount || 0).toLocaleString('fr-FR')} XOF</p>
                <p><strong>Canal :</strong> {payment.provider === 'flooz' ? 'Flooz' : payment.provider === 'tmoney' ? 'TMoney' : payment.provider}</p>
                <p><strong>Statut :</strong> {payment.status}</p>
              </article>
            )) : <p className="text-sm text-black/55">Aucun paiement enregistre pour le moment.</p>}
          </div>

          {pendingReservations.length ? (
            <div className="mt-8 rounded-[24px] bg-[#fcf4f5] p-5 text-sm leading-7 text-black/70">
              En mode `live`, une page PayGate s'ouvre pour finaliser le paiement. En mode `mock`, une transaction de test est enregistree localement par l'API.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSiteData()

  return (
    <div className="min-h-screen bg-[#f7eaea] text-[#171717]">
      <Navbar onBookNow={() => navigate('/#reservation')} isAdminAuthenticated={user?.role === 'admin'} />
      {isAuthenticated ? <AccountDashboard /> : <AuthCard />}
      <Footer />
    </div>
  )
}
