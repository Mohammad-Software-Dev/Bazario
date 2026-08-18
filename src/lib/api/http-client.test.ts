import type { InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import i18n from '@/lib/i18n'
import { applyHttpClientRequestContext } from '@/lib/api/http-client'

vi.mock('@/lib/auth/auth-storage', () => ({
  getAuthToken: () => null,
}))

describe('http client request context', () => {
  it('sends Accept-Language as ar when arabic is active', async () => {
    await i18n.changeLanguage('ar')

    const config = applyHttpClientRequestContext({
      headers: {},
    } as InternalAxiosRequestConfig)

    expect(config.headers['Accept-Language']).toBe('ar')
  })
})
