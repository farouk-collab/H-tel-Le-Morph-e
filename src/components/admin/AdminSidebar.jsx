import { LogOut, X } from 'lucide-react'

export default function AdminSidebar({ navItems, activeSection, setActiveSection, user, logout, isOpen, setIsOpen }) {
  return (
    <>
      {isOpen ? <button type="button" aria-label="Fermer le menu" onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-[#2f1b1f]/30 backdrop-blur-[1px] lg:hidden" /> : null}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[292px] overflow-y-auto border-r border-[#7a2230]/10 bg-[linear-gradient(180deg,#fffaf8_0%,#f7eaea_100%)] px-5 py-6 text-[#2f1b1f] shadow-[0_25px_90px_rgba(122,34,48,0.18)] transition-transform duration-300 lg:static lg:w-auto lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#a07a82]">Navigation</p>
        <button type="button" onClick={() => setIsOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#7a2230]/12 bg-white text-[#7a2230]">
          <X size={18} />
        </button>
      </div>
      <button type="button" onClick={() => {
        setActiveSection('overview')
        setIsOpen(false)
      }} className="flex w-full items-center gap-3 rounded-[24px] border border-[#7a2230]/10 bg-white/75 px-4 py-4 text-left shadow-[0_18px_40px_rgba(122,34,48,0.08)]">
        <img src="/images/logo-hotel-le-morphee.jpg" alt="Logo Hotel Le Morphee" className="h-12 w-12 rounded-2xl bg-white object-cover shadow-sm" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#a07a82]">Hotel Le Morphee</p>
          <p className="mt-1 font-serif text-2xl text-[#2f1b1f]">Dashboard</p>
        </div>
      </button>

      <div className="mt-8 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.id === activeSection
          const badgeCount = Number(item.badgeCount || 0)

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id)
                setIsOpen(false)
              }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${active ? 'bg-[#7a2230] text-white shadow-[0_18px_40px_rgba(122,34,48,0.22)]' : 'text-[#6d4a51] hover:bg-white/70 hover:text-[#7a2230]'}`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 ? (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${active ? 'bg-white/18 text-white' : 'bg-[#f4dbe0] text-[#7a2230]'}`}>
                  {badgeCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mt-10 rounded-[24px] border border-[#7a2230]/10 bg-white/72 p-4 shadow-[0_18px_40px_rgba(122,34,48,0.08)]">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#a07a82]">Session</p>
        <p className="mt-3 text-sm font-semibold text-[#2f1b1f]">{user?.email}</p>
        <p className="mt-1 text-xs text-[#7a5c61]">Administration separee du site client</p>
        <button type="button" onClick={() => {
          setIsOpen(false)
          logout()
        }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#7a2230]/14 bg-[#fff8f7] px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#7a2230] hover:text-white">
          <LogOut size={14} />
          Deconnexion
        </button>
      </div>
      </aside>
    </>
  )
}
