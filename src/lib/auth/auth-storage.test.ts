import { describe, expect, it } from 'vitest'

import {
  clearStoredSession,
  getAuthToken,
  getStoredSession,
  persistSession,
} from '@/lib/auth/auth-storage'
import type { AuthSession } from '@/features/auth/types/auth.types'

const STORAGE_KEY = 'bazario.auth.session'

const session: AuthSession = {
  token: 'test-token',
  roles: ['customer'],
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: null,
    age: null,
  },
}

describe('auth storage', () => {
  it('writes a session to local storage', () => {
    persistSession(session)

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(session))
  })

  it('reads a parsed session from local storage', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

    expect(getStoredSession()).toEqual(session)
  })

  it('clears a stored session', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

    clearStoredSession()

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('returns the stored auth token', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

    expect(getAuthToken()).toBe('test-token')
  })

  it('returns null and removes invalid stored session json', () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken-json')

    expect(getStoredSession()).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
