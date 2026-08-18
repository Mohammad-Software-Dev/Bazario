import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

import i18n from '@/lib/i18n'

beforeEach(() => {
  void i18n.changeLanguage('en')
  window.localStorage.clear()
  window.sessionStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  void i18n.changeLanguage('en')
  window.localStorage.clear()
  window.sessionStorage.clear()
})
