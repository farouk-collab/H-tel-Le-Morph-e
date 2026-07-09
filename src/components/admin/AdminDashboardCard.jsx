export default function AdminDashboardCard({ title, eyebrow, children, actions = null }) {
  return (
    <section className="rounded-[28px] border border-[#7a2230]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,248,246,0.96))] p-6 shadow-[0_24px_80px_rgba(122,34,48,0.08)] backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-[11px] uppercase tracking-[0.28em] text-[#a07a82]">{eyebrow}</p> : null}
          <h2 className="mt-2 font-serif text-3xl text-[#2f1b1f]">{title}</h2>
        </div>
        {actions}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}
