import AdminDashboardCard from './AdminDashboardCard'
import AdminStatusBadge from './AdminStatusBadge'
import { downloadCsv } from '../../lib/csv'

export default function AdminOperationsPanel({ adminReservations, handleCancelReservation }) {
  const exportReservations = () => {
    downloadCsv(`reservations-hotel-le-morphee-${new Date().toISOString().slice(0, 10)}.csv`, adminReservations.map((reservation) => ({
      id: reservation.id,
      status: reservation.status || '',
      payment_status: reservation.paymentStatus || '',
      type: reservation.type || '',
      user_name: reservation.userName || '',
      user_email: reservation.userEmail || '',
      phone: reservation.phone || '',
      room_name: reservation.roomName || '',
      space_name: reservation.spaceName || '',
      check_in: reservation.checkIn || '',
      check_out: reservation.checkOut || '',
      event_date: reservation.eventDate || '',
      amount: reservation.amount || '',
      payment_method: reservation.paymentMethod || '',
      created_at: reservation.createdAt || '',
      updated_at: reservation.updatedAt || '',
    })))
  }

  return (
    <AdminDashboardCard
      title="Reservations recues"
      eyebrow="Exploitation"
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportReservations} disabled={!adminReservations.length} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1] disabled:cursor-not-allowed disabled:opacity-50">
            Export CSV
          </button>
          <span className="rounded-full bg-[#f4dbe0] px-4 py-2 text-sm font-semibold text-[#7a2230]">{adminReservations.length} reservation{adminReservations.length > 1 ? 's' : ''}</span>
        </div>
      )}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {adminReservations.length ? adminReservations.map((reservation) => (
          <article key={reservation.id} className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5 text-sm leading-7 text-[#6d4a51]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p><strong className="text-[#3f252a]">Client :</strong> {reservation.userName || reservation.userEmail || 'Non renseigne'}</p>
                <p><strong className="text-[#3f252a]">Prestation :</strong> {reservation.roomName || reservation.spaceName || 'Reservation'}</p>
              </div>
              <AdminStatusBadge status={reservation.status || 'pending'} />
            </div>
            <p className="mt-3"><strong className="text-[#3f252a]">Periode :</strong> {reservation.checkIn ? `${reservation.checkIn} au ${reservation.checkOut}` : reservation.eventDate || 'a confirmer'}</p>
            <p><strong className="text-[#3f252a]">Paiement :</strong> <AdminStatusBadge status={reservation.paymentStatus || 'pending'} className="ml-2" /></p>
            {reservation.status !== 'canceled' && reservation.paymentStatus !== 'completed' ? (
              <button type="button" onClick={() => handleCancelReservation(reservation.id)} className="mt-4 rounded-full border border-[#d79aa5] bg-[#fff1f3] px-4 py-2 text-sm font-semibold text-[#b4233c] transition hover:bg-[#ffe4e8]">
                Annuler la reservation
              </button>
            ) : reservation.status === 'canceled' ? <p className="mt-4 text-xs text-[#b4233c]">Reservation deja annulee.</p> : <p className="mt-4 text-xs text-[#8d6c72]">Reservation payee : annulation manuelle uniquement.</p>}
          </article>
        )) : <p className="text-sm text-[#7a5c61]">Aucune reservation enregistree.</p>}
      </div>
    </AdminDashboardCard>
  )
}
