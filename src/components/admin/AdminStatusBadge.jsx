function getStatusConfig(status) {
  const normalized = String(status || 'pending').trim().toLowerCase()

  switch (normalized) {
    case 'completed':
    case 'confirmed':
    case 'paid':
      return {
        label: normalized === 'confirmed' ? 'confirmed' : 'completed',
        className: 'bg-[#e7f6ee] text-[#17603a] border-[#b9e4c8]',
      }
    case 'pending':
    case 'processing':
    case 'initiated':
      return {
        label: 'pending',
        className: 'bg-[#fff4df] text-[#9a5b00] border-[#f1d39f]',
      }
    case 'failed':
    case 'error':
    case 'rejected':
      return {
        label: 'failed',
        className: 'bg-[#fff1f3] text-[#b4233c] border-[#efc2ca]',
      }
    case 'canceled':
    case 'cancelled':
      return {
        label: 'canceled',
        className: 'bg-[#f4dbe0] text-[#7a2230] border-[#dfbcc4]',
      }
    default:
      return {
        label: normalized,
        className: 'bg-[#f8ecef] text-[#7a2230] border-[#e7cfd5]',
      }
  }
}

export default function AdminStatusBadge({ status, className = '' }) {
  const config = getStatusConfig(status)

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${config.className} ${className}`.trim()}>
      {config.label}
    </span>
  )
}
