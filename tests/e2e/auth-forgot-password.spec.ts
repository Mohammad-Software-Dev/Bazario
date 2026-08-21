import { expect, test } from '@playwright/test'

import {
  getResetTestCredentials,
  submitForgotPassword,
  submitResetPassword,
  submitVerificationCode,
} from './helpers/auth-reset'
import { clearAppStorage, forceEnglishLanguage } from './helpers/storage'

test.describe('Forgot password flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page)
    await forceEnglishLanguage(page)
  })

  test('completes the happy path and opens the login dialog after reset', async ({ page }) => {
    const { email, newPassword } = getResetTestCredentials()

    await submitForgotPassword(page, email)
    await submitVerificationCode(page)
    await submitResetPassword(page, newPassword)

    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  test('redirects back to forgot password when reset email context is missing', async ({ page }) => {
    await page.goto('/verify-reset-otp')

    await expect(page).toHaveURL(/\/forgot-password$/)
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send verification code' })).toBeVisible()
  })

  test('shows resend countdown after requesting another verification code', async ({ page }) => {
    const { email } = getResetTestCredentials()

    await submitForgotPassword(page, email)

    const resendButton = page.getByRole('button', { name: 'Resend code' })
    await expect(resendButton).toBeVisible()
    await resendButton.click()

    await expect(page.getByText(/You can resend the code in 2:00\./)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Verify code' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Resend code' })).toHaveCount(0)
  })
})
