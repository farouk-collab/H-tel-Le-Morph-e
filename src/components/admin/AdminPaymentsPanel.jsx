import { useMemo, useState } from 'react'
import AdminDashboardCard from './AdminDashboardCard'
import AdminPaymentCard from './AdminPaymentCard'
import { downloadCsv } from '../../lib/csv'

export default function AdminPaymentsPanel({
  paymentSimulationForm,
  setPaymentSimulationForm,
  handleSimulatePayment,
  adminPayments,
  handleCopyPaymentReference,
  handleQuickSimulatePayment,
  handlePrefillSimulation,
}) {
  const [search, setSearch] = useState('')

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return adminPayments

    return adminPayments.filter((payment) => {
      const haystack = [
        payment.reference,
        payment.status,
        payment.userEmail,
        payment.userName,
        payment.roomName,
        payment.spaceName,
        payment.label,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [adminPayments, search])

  const exportPayments = () => {
    downloadCsv(`paiements-hotel-le-morphee-${new Date().toISOString().slice(0, 10)}.csv`, filteredPayments.map((payment) => ({
      reference: payment.reference,
      status: payment.status,
      provider: payment.provider,
      amount: payment.amount,
      currency: payment.currency || 'XOF',
      user_name: payment.userName || '',
      user_email: payment.userEmail || '',
      phone: payment.phone || '',
      reservation_id: payment.reservationId || '',
      created_at: payment.createdAt || '',
      updated_at: payment.updatedAt || '',
    })))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <AdminDashboardCard title="Simulation PayGate" eyebrow="Paiements">
        <form onSubmit={handleSimulatePayment} className="grid gap-4">
          <input value={paymentSimulationForm.reference} onChange={(e) => setPaymentSimulationForm((current) => ({ ...current, reference: e.target.value }))} placeholder="Reference de paiement" className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white" />
          <select value={paymentSimulationForm.status} onChange={(e) => setPaymentSimulationForm((current) => ({ ...current, status: e.target.value }))} className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white">
            <option value="completed">completed</option>
            <option value="pending">pending</option>
            <option value="failed">failed</option>
            <option value="canceled">canceled</option>
          </select>
          <button type="submit" className="rounded-2xl bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">Simuler le callback</button>
          <p className="text-xs leading-6 text-[#7a5c61]">Utilise une reference existante pour tester la boucle complete cote compte client sans dependre du prestataire.</p>
        </form>
      </AdminDashboardCard>

      <AdminDashboardCard
        title="Historique des paiements"
        eyebrow="Suivi"
        actions={(
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={exportPayments} disabled={!filteredPayments.length} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50">
              Export CSV
            </button>
            <span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''}</span>
          </div>
        )}
      >
        <div className="mb-4 grid gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par reference, client, email ou statut"
            className="h-12 rounded-2xl border border-[#e5cfd3] bg-[#fff8f7] px-4 text-sm text-[#4e2c32] outline-none transition focus:border-[#7a2230] focus:bg-white"
          />
          {search ? <p className="text-xs text-[#7a5c61]">Filtre actif sur les paiements.</p> : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredPayments.length ? filteredPayments.map((payment) => (
            <AdminPaymentCard
              key={payment.id}
              payment={payment}
              onCopyReference={handleCopyPaymentReference}
              onQuickSimulate={handleQuickSimulatePayment}
              onPrefillSimulation={handlePrefillSimulation}
            />
          )) : <p className="text-sm text-[#7a5c61]">{adminPayments.length ? 'Aucun paiement ne correspond a cette recherche.' : 'Aucun paiement enregistre.'}</p>}
        </div>
      </AdminDashboardCard>
    </div>
  )
}
