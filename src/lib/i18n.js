export function pickLocalized(value, language) {
  if (value && typeof value === 'object' && 'fr' in value && 'en' in value) {
    return value[language] ?? value.fr
  }

  return value
}
