import AdminDashboardCard from './AdminDashboardCard'

export default function AdminSettingsPanel({ navigate, setActiveSection, user, logout }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <AdminDashboardCard title="Pilotage rapide" eyebrow="Raccourcis">
        <div className="grid gap-3">
          {[
            ['Ouvrir le site client', () => navigate('/')],
            ['Aller aux paiements', () => setActiveSection('payments')],
            ['Lire les reservations', () => setActiveSection('operations')],
            ['Creer une chambre', () => setActiveSection('rooms')],
          ].map(([label, action]) => (
            <button key={label} type="button" onClick={action} className="rounded-[20px] border border-[#7a2230]/10 bg-[#fff8f7] px-4 py-4 text-left text-sm font-semibold text-[#4e2c32] transition hover:border-[#7a2230] hover:bg-white hover:text-[#7a2230]">
              {label}
            </button>
          ))}
        </div>
      </AdminDashboardCard>

      <AdminDashboardCard title="Compte connecte" eyebrow="Session">
        <div className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5 text-sm leading-7 text-[#6d4a51]">
          <p><strong className="text-[#3f252a]">Email :</strong> {user?.email}</p>
          <p><strong className="text-[#3f252a]">Role :</strong> {user?.role}</p>
          <p><strong className="text-[#3f252a]">Contexte :</strong> dashboard independant du site client</p>
          <button type="button" onClick={logout} className="mt-5 rounded-2xl bg-[#7a2230] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5d1824]">
            Deconnexion
          </button>
        </div>
      </AdminDashboardCard>
    </div>
  )
}
