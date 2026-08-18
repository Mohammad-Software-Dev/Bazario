import { describe, expect, it } from 'vitest'

import { getIntlLocale, isRtlLanguage, normalizeAppLanguage } from '@/lib/i18n/format'

describe('i18n format helpers', () => {
  it('normalizes arabic language codes to ar', () => {
    expect(normalizeAppLanguage('ar')).toBe('ar')
    expect(normalizeAppLanguage('ar-SA')).toBe('ar')
  })

  it('maps arabic to an rtl language', () => {
    expect(isRtlLanguage('ar')).toBe(true)
    expect(isRtlLanguage('en')).toBe(false)
  })

  it('maps arabic to the arabic intl locale', () => {
    expect(getIntlLocale('ar')).toBe('ar')
  })
})
