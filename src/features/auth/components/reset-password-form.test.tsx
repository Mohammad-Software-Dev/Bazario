import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'
import { createApiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render-with-providers'

const navigateMock = vi.fn()
const openLoginDialogMock = vi.fn()
const mutateAsyncMock = vi.fn()
const useResetPasswordMutationMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/features/auth/hooks/use-reset-password-mutation', () => ({
  useResetPasswordMutation: () => useResetPasswordMutationMock(),
}))

vi.mock('@/stores/ui-store', () => ({
  useUiStore: (selector: (state: { openLoginDialog: () => void }) => unknown) =>
    selector({
      openLoginDialog: openLoginDialogMock,
    }),
}))

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    openLoginDialogMock.mockReset()
    mutateAsyncMock.mockReset()
    useResetPasswordMutationMock.mockReset()
    useResetPasswordMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
  })

  it('redirects to forgot-password when reset email is missing', async () => {
    renderWithProviders(<ResetPasswordForm />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/forgot-password', { replace: true })
    })
  })

  it('shows missing-token state and disables submit when token is absent', async () => {
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')

    renderWithProviders(<ResetPasswordForm />)

    expect(await screen.findByText('Missing reset token. Please verify the code first.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset password' })).toBeDisabled()
  })

  it('submits stored email and token, clears flow, opens login dialog, and navigates home', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    window.sessionStorage.setItem('bazario-reset-token', 'reset-token-123')
    mutateAsyncMock.mockResolvedValue({
      success: 1 as const,
      message: 'Password reset',
      result: null,
    })

    renderWithProviders(<ResetPasswordForm />)

    await user.type(screen.getByLabelText('New password'), 'secret123')
    await user.type(screen.getByLabelText('Confirm password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        token: 'reset-token-123',
        password: 'secret123',
      })
    })

    expect(window.sessionStorage.getItem('bazario-reset-email')).toBeNull()
    expect(window.sessionStorage.getItem('bazario-reset-token')).toBeNull()
    expect(openLoginDialogMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('shows api password error when returned', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    window.sessionStorage.setItem('bazario-reset-token', 'reset-token-123')
    mutateAsyncMock.mockRejectedValue(
      createApiError('Unable to reset password.', {
        password: ['Password is too weak.'],
      }),
    )

    renderWithProviders(<ResetPasswordForm />)

    await user.type(screen.getByLabelText('New password'), 'secret123')
    await user.type(screen.getByLabelText('Confirm password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    expect(await screen.findByText('Password is too weak.')).toBeInTheDocument()
    expect(screen.getByText('Unable to reset password.')).toBeInTheDocument()
  })

  it('shows token error when returned by the backend', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    window.sessionStorage.setItem('bazario-reset-token', 'reset-token-123')
    mutateAsyncMock.mockRejectedValue(
      createApiError('Token invalid.', {
        token: ['Reset token expired.'],
      }),
    )

    renderWithProviders(<ResetPasswordForm />)

    await user.type(screen.getByLabelText('New password'), 'secret123')
    await user.type(screen.getByLabelText('Confirm password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))

    expect(await screen.findByText('Reset token expired.')).toBeInTheDocument()
  })

  it('opens login dialog and navigates home from the back-to-login button', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    window.sessionStorage.setItem('bazario-reset-token', 'reset-token-123')

    renderWithProviders(<ResetPasswordForm />)

    await user.click(screen.getByRole('button', { name: 'Back to login' }))

    expect(openLoginDialogMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
