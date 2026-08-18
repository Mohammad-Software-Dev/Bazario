import i18n from '@/lib/i18n'
import type { AppLanguage } from '@/lib/i18n/types'

export function normalizeAppLanguage(language?: string | null): AppLanguage {
  const value = language ?? i18n.resolvedLanguage ?? i18n.language ?? 'en'

  if (value.startsWith('ar')) {
    return 'ar'
  }

  if (value.startsWith('de')) {
    return 'de'
  }

  return 'en'
}

export function getAppLanguage(language?: string | null): AppLanguage {
  return normalizeAppLanguage(language)
}

export function isRtlLanguage(language?: string | null) {
  return getAppLanguage(language) === 'ar'
}

export function getIntlLocale(language?: string | null) {
  const appLanguage = getAppLanguage(language)

  if (appLanguage === 'ar') {
    return 'ar'
  }

  if (appLanguage === 'de') {
    return 'de-DE'
  }

  return 'en-GB'
}

export function formatMoney(amount: number, currency = 'EUR', language?: string | null) {
  return new Intl.NumberFormat(getIntlLocale(language), {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatMinorMoney(amount: number, currency = 'EUR', language?: string | null) {
  return formatMoney(amount / 100, currency, language)
}

export function formatDateTime(value: string | Date, options?: Intl.DateTimeFormatOptions, language?: string | null) {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), options).format(date)
}
