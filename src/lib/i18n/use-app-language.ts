import { useTranslation } from 'react-i18next'

import { isRtlLanguage, normalizeAppLanguage } from '@/lib/i18n/format'
import type { AppLanguage } from '@/lib/i18n/types'

export function useAppLanguage() {
  const { i18n } = useTranslation()
  const language = normalizeAppLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'en')

  return {
    language,
    isEnglish: language === 'en',
    isGerman: language === 'de',
    isArabic: language === 'ar',
    isRtl: isRtlLanguage(language),
    changeLanguage: (nextLanguage: AppLanguage) => i18n.changeLanguage(nextLanguage),
  }
}
