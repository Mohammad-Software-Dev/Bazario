import { useTranslation } from 'react-i18next'

import type { AppLanguage } from '@/lib/i18n/types'

function normalizeLanguage(language: string): AppLanguage {
  return language.startsWith('de') ? 'de' : 'en'
}

export function useAppLanguage() {
  const { i18n } = useTranslation()
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'en')

  return {
    language,
    isEnglish: language === 'en',
    isGerman: language === 'de',
    changeLanguage: (nextLanguage: AppLanguage) => i18n.changeLanguage(nextLanguage),
  }
}
