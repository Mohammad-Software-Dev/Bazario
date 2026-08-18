import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { queryClient } from '@/app/providers/query-client'
import { isRtlLanguage, normalizeAppLanguage } from '@/lib/i18n/format'
import ar from '@/lib/i18n/messages/ar'
import de from '@/lib/i18n/messages/de'
import en from '@/lib/i18n/messages/en'

const resources = {
  en: { translation: en },
  de: { translation: de },
  ar: { translation: ar },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'ar'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'bazario-language',
    },
  })

function syncDocumentLanguage(language: string) {
  if (typeof document === 'undefined') {
    return
  }

  const normalizedLanguage = normalizeAppLanguage(language)
  const isRtl = isRtlLanguage(normalizedLanguage)

  document.documentElement.lang = normalizedLanguage
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  document.documentElement.classList.toggle('font-arabic', isRtl)
}

function refreshLocalizedQueries() {
  void queryClient.invalidateQueries()
}

syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'en')
i18n.on('languageChanged', syncDocumentLanguage)
i18n.on('languageChanged', refreshLocalizedQueries)

export default i18n
