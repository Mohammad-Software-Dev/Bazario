import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import de from '@/lib/i18n/messages/de'
import en from '@/lib/i18n/messages/en'

const resources = {
  en: { translation: en },
  de: { translation: de },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
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

  const normalizedLanguage = language.startsWith('de') ? 'de' : 'en'

  document.documentElement.lang = normalizedLanguage
  document.documentElement.dir = 'ltr'
}

syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language ?? 'en')
i18n.on('languageChanged', syncDocumentLanguage)

export default i18n
