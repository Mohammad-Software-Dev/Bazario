import { expect, type Page } from '@playwright/test'

export interface ResetTestCredentials {
  email: string
  newPassword: string
}

const FIXED_RESET_CODE = '111111'

export function getResetTestCredentials(): ResetTestCredentials {
  const email = process.env.PLAYWRIGHT_TEST_RESET_EMAIL?.trim()
  const newPassword = process.env.PLAYWRIGHT_TEST_RESET_NEW_PASSWORD?.trim()

  if (!email) {
    throw new Error('Missing PLAYWRIGHT_TEST_RESET_EMAIL for forgot-password E2E tests.')
  }

  if (!newPassword) {
    throw new Error('Missing PLAYWRIGHT_TEST_RESET_NEW_PASSWORD for forgot-password E2E tests.')
  }

  return { email, newPassword }
}

export async function submitForgotPassword(page: Page, email: string) {
  await page.goto('/forgot-password')
  await expect(page).toHaveURL(/\/forgot-password$/)
  await page.getByLabel('Email').fill(email)
  await page.getByRole('button', { name: 'Send verification code' }).click()
  await expect(page).toHaveURL(/\/verify-reset-otp$/)
  await expect(page.getByLabel('Verification code digit 1')).toBeVisible()
}

export async function fillVerificationCode(page: Page, code = FIXED_RESET_CODE) {
  for (const [index, digit] of Array.from(code).entries()) {
    await page.getByLabel(`Verification code digit ${index + 1}`).fill(digit)
  }
}

export async function submitVerificationCode(page: Page, code = FIXED_RESET_CODE) {
  await fillVerificationCode(page, code)
  await page.getByRole('button', { name: 'Verify code' }).click()
  await expect(page).toHaveURL(/\/reset-password$/)
  await expect(page.getByLabel('New password')).toBeVisible()
}

export async function submitResetPassword(page: Page, newPassword: string) {
  await page.getByLabel('New password').fill(newPassword)
  await page.getByLabel('Confirm password').fill(newPassword)
  await page.getByRole('button', { name: 'Reset password' }).click()
}
