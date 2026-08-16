import { describe, expect, it } from 'vitest'

import {
  clearPasswordResetEmail,
  clearPasswordResetFlow,
  clearPasswordResetToken,
  getPasswordResetEmail,
  getPasswordResetToken,
  setPasswordResetEmail,
  setPasswordResetToken,
} from '@/features/auth/lib/password-reset-storage'

describe('password reset storage', () => {
  it('round-trips reset email through session storage', () => {
    setPasswordResetEmail('user@example.com')

    expect(getPasswordResetEmail()).toBe('user@example.com')
  })

  it('round-trips reset token through session storage', () => {
    setPasswordResetToken('reset-token')

    expect(getPasswordResetToken()).toBe('reset-token')
  })

  it('clears only the reset email', () => {
    setPasswordResetEmail('user@example.com')
    setPasswordResetToken('reset-token')

    clearPasswordResetEmail()

    expect(getPasswordResetEmail()).toBe('')
    expect(getPasswordResetToken()).toBe('reset-token')
  })

  it('clears only the reset token', () => {
    setPasswordResetEmail('user@example.com')
    setPasswordResetToken('reset-token')

    clearPasswordResetToken()

    expect(getPasswordResetEmail()).toBe('user@example.com')
    expect(getPasswordResetToken()).toBe('')
  })

  it('clears the entire reset flow', () => {
    setPasswordResetEmail('user@example.com')
    setPasswordResetToken('reset-token')

    clearPasswordResetFlow()

    expect(getPasswordResetEmail()).toBe('')
    expect(getPasswordResetToken()).toBe('')
  })
})
