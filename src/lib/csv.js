function escapeCsvValue(value) {
  const normalized = String(value ?? '').replace(/\r?\n|\r/g, ' ').trim()
  return `"${normalized.replace(/"/g, '""')}"`
}

export function downloadCsv(filename, rows) {
  if (!rows?.length) return false

  const headers = Object.keys(rows[0])
  const csvLines = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
  ]

  const blob = new Blob(["\uFEFF" + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}
