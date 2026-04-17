export function formatPrice(price, locale = 'fr-FR', currency = 'XOF') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function buildWhatsAppLink(phone, message) {
  const normalized = String(phone).replace(/\D/g, '')
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
