import AdminStatusBadge from './AdminStatusBadge'

export default function AdminPaymentCard({ payment, onPrefillSimulation, onCopyReference, onQuickSimulate }) {
  return (
    <article className="rounded-[24px] border border-[#7a2230]/10 bg-[#fff8f7] p-5 text-sm leading-7 text-[#6d4a51]">
      <p><strong className="text-[#3f252a]">Reference :</strong> {payment.reference}</p>
      <p><strong className="text-[#3f252a]">Montant :</strong> {Number(payment.amount || 0).toLocaleString('fr-FR')} XOF</p>
      <p><strong className="text-[#3f252a]">Canal :</strong> {payment.provider}</p>
      <p><strong className="text-[#3f252a]">Statut :</strong> <AdminStatusBadge status={payment.status} className="ml-2" /></p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => onCopyReference(payment.reference)} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">
          Copier la reference
        </button>
        <button type="button" onClick={() => onQuickSimulate(payment.reference)} className="rounded-full bg-[#7a2230] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5d1824]">
          Simuler completed
        </button>
        <button type="button" onClick={() => onPrefillSimulation(payment.reference)} className="rounded-full border border-[#7a2230]/14 bg-white px-4 py-2 text-xs font-semibold text-[#7a2230] transition hover:bg-[#fff3f1]">
          Pre-remplir
        </button>
      </div>
    </article>
  )
}
