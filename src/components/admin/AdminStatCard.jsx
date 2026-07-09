export default function AdminStatCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <article className="rounded-[24px] border border-[#7a2230]/10 bg-[linear-gradient(180deg,#fffdfc_0%,#fff5f3_100%)] p-5 shadow-[0_16px_50px_rgba(122,34,48,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-[#a07a82]">{label}</p>
          <p className="mt-3 font-serif text-4xl text-[#2f1b1f]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-[#7a5c61]">{hint}</p>
    </article>
  )
}
