import i18n from '@/lib/i18n'
import { getAppLanguage } from '@/lib/i18n/format'
import type { AppLanguage } from '@/lib/i18n/types'

export type LocalizedValue =
  | string
  | null
  | undefined
  | {
      en?: string | null
      de?: string | null
      ar?: string | null
    }

export function getLocalizedValue(value: LocalizedValue, preferredLanguage?: AppLanguage | string) {
  if (typeof value === 'string') {
    return value
  }

  if (!value) {
    return ''
  }

  const language = getAppLanguage(preferredLanguage ?? i18n.resolvedLanguage ?? i18n.language)

  if (language === 'ar') {
    return value.ar ?? value.en ?? value.de ?? ''
  }

  if (language === 'de') {
    return value.de ?? value.en ?? value.ar ?? ''
  }

  return value.en ?? value.de ?? value.ar ?? ''
}
