import { Plus } from 'lucide-react'
import AdminDashboardCard from './AdminDashboardCard'
import AdminStatCard from './AdminStatCard'
import AdminStatusBadge from './AdminStatusBadge'

export default function AdminOverviewPanel({ stats, adminReservations, setActiveSection }) {
  return (
    <div className="grid gap-6">
      <AdminDashboardCard title="Vue d ensemble" eyebrow="Cockpit">
        <div className="grid gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <AdminStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </AdminDashboardCard>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <AdminDashboardCard title="Activite recente" eyebrow="Reservations">
          <div className="grid gap-3">
            {adminReservations.slice(0, 4).map((reservation) => (
              <div key={reservation.id} className="rounded-[22px] border border-[#7a2230]/10 bg-[#fff8f7] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#2f1b1f]">{reservation.userName || reservation.userEmail || 'Client non renseigne'}</p>
                    <p className="mt-1 text-sm text-[#7a5c61]">{reservation.roomName || reservation.spaceName || 'Reservation'}</p>
                  </div>
                  <AdminStatusBadge status={reservation.status || 'pending'} />
                </div>
                <p className="mt-3 text-xs text-[#8d6c72]">{reservation.checkIn ? `Du ${reservation.checkIn} au ${reservation.checkOut}` : `Evenement le ${reservation.eventDate || 'a confirmer'}`}</p>
              </div>
            ))}
            {!adminReservations.length ? <p className="text-sm text-[#7a5c61]">Aucune reservation enregistree pour le moment.</p> : null}
          </div>
        </AdminDashboardCard>

        <AdminDashboardCard title="Acces rapides" eyebrow="Navigation">
          <div className="grid gap-3">
            {[
              ['Creer une chambre', 'rooms'],
              ['Creer une salle', 'spaces'],
              ['Simuler un paiement', 'payments'],
              ['Lire les messages entrants', 'inbox'],
            ].map(([label, section]) => (
              <button key={label} type="button" onClick={() => setActiveSection(section)} className="flex items-center justify-between rounded-[20px] border border-[#7a2230]/10 bg-[#fff8f7] px-4 py-4 text-left text-sm font-semibold text-[#4e2c32] transition hover:border-[#7a2230] hover:bg-white hover:text-[#7a2230]">
                {label}
                <Plus size={16} />
              </button>
            ))}
          </div>
        </AdminDashboardCard>
      </div>
    </div>
  )
}
