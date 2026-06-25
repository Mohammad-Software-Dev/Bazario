export type LocalizedValue = string | null | undefined | Record<string, string | null | undefined>

const DEFAULT_LOCALE = 'en'

export function getLocalizedValue(value: LocalizedValue, locale = DEFAULT_LOCALE) {
  if (typeof value === 'string') {
    return value
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const directMatch = value[locale]

  if (typeof directMatch === 'string' && directMatch.trim() !== '') {
    return directMatch
  }

  const fallbackMatch = value[DEFAULT_LOCALE]

  if (typeof fallbackMatch === 'string' && fallbackMatch.trim() !== '') {
    return fallbackMatch
  }

  const firstAvailable = Object.values(value).find(
    (entry) => typeof entry === 'string' && entry.trim() !== '',
  )

  return typeof firstAvailable === 'string' ? firstAvailable : null
}
