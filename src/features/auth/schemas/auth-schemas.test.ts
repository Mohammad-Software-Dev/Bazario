import { z } from 'zod'
import { describe, expect, it } from 'vitest'

import { forgotPasswordSchema } from '@/features/auth/schemas/forgot-password-schema'
import { loginSchema } from '@/features/auth/schemas/login-schema'
import { resetPasswordSchema } from '@/features/auth/schemas/reset-password-schema'
import { verifyResetOtpSchema } from '@/features/auth/schemas/verify-reset-otp-schema'

describe('auth schemas', () => {
  it('accepts valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty login email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'secret123',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.email).toContain('Email is required.')
  })

  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.email).toContain('Enter a valid email address.')
  })

  it('accepts a valid forgot-password email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'user@example.com',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid forgot-password email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'wrong',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.email).toContain('Enter a valid email address.')
  })

  it('accepts a six-digit verification code', () => {
    const result = verifyResetOtpSchema.safeParse({
      otp: '123456',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a short verification code', () => {
    const result = verifyResetOtpSchema.safeParse({
      otp: '12345',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.otp).toContain('Enter the 6-digit verification code.')
  })

  it('rejects a long verification code', () => {
    const result = verifyResetOtpSchema.safeParse({
      otp: '1234567',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.otp).toContain('Enter the 6-digit verification code.')
  })

  it('rejects a non-numeric verification code', () => {
    const result = verifyResetOtpSchema.safeParse({
      otp: '12ab56',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.otp).toContain('Enter the 6-digit verification code.')
  })

  it('accepts matching reset-password values', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'secret123',
      password_confirmation: 'secret123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a short reset password', () => {
    const result = resetPasswordSchema.safeParse({
      password: '123',
      password_confirmation: '123',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.password).toContain(
      'Password must be at least 6 characters long.',
    )
  })

  it('rejects mismatched reset-password confirmation', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'secret123',
      password_confirmation: 'secret124',
    })

    expect(result.success).toBe(false)
    expect(z.flattenError(result.error!).fieldErrors.password_confirmation).toContain(
      'Passwords do not match.',
    )
  })
})
