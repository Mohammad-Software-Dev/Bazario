import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VerifyResetOtpForm } from '@/features/auth/components/verify-reset-otp-form'
import { createApiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render-with-providers'

const navigateMock = vi.fn()
const mutateAsyncMock = vi.fn()
const resendMutateAsyncMock = vi.fn()
const useVerifyResetOtpMutationMock = vi.fn()
const useForgotPasswordMutationMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/features/auth/hooks/use-verify-reset-otp-mutation', () => ({
  useVerifyResetOtpMutation: () => useVerifyResetOtpMutationMock(),
}))

vi.mock('@/features/auth/hooks/use-forgot-password-mutation', () => ({
  useForgotPasswordMutation: () => useForgotPasswordMutationMock(),
}))

describe('VerifyResetOtpForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    mutateAsyncMock.mockReset()
    resendMutateAsyncMock.mockReset()
    useVerifyResetOtpMutationMock.mockReset()
    useForgotPasswordMutationMock.mockReset()
    useVerifyResetOtpMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
    useForgotPasswordMutationMock.mockReturnValue({
      mutateAsync: resendMutateAsyncMock,
      isPending: false,
    })
  })

  it('redirects to forgot-password when reset email is missing', async () => {
    renderWithProviders(<VerifyResetOtpForm />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/forgot-password', { replace: true })
    })
  })

  it('renders verification code input when reset email exists', () => {
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')

    renderWithProviders(<VerifyResetOtpForm />)

    expect(screen.getByLabelText('Verification code digit 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verify code' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeInTheDocument()
  })

  it('rejects invalid otp format before mutation', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')

    renderWithProviders(<VerifyResetOtpForm />)

    await user.type(screen.getByLabelText('Verification code digit 1'), '1')
    await user.click(screen.getByRole('button', { name: 'Verify code' }))

    expect(await screen.findByText('Enter the 6-digit verification code.')).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  it('submits stored email and entered otp, then stores token and navigates', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    mutateAsyncMock.mockResolvedValue({
      success: 1 as const,
      message: 'Verified',
      result: { token: 'reset-token-123' },
    })

    renderWithProviders(<VerifyResetOtpForm />)

    await user.type(screen.getByLabelText('Verification code digit 1'), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify code' }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        otp: '123456',
      })
    })

    expect(window.sessionStorage.getItem('bazario-reset-token')).toBe('reset-token-123')
    expect(navigateMock).toHaveBeenCalledWith('/reset-password')
  })

  it('shows api otp error when returned', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    mutateAsyncMock.mockRejectedValue(
      createApiError('Verification code invalid.', {
        otp: ['Verification code has expired.'],
      }),
    )

    renderWithProviders(<VerifyResetOtpForm />)

    await user.type(screen.getByLabelText('Verification code digit 1'), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify code' }))

    expect(await screen.findByText('Verification code has expired.')).toBeInTheDocument()
    expect(screen.getByText('Verification code invalid.')).toBeInTheDocument()
  })

  it('shows fallback server error for generic failure', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    mutateAsyncMock.mockRejectedValue(new Error('Verification failed'))

    renderWithProviders(<VerifyResetOtpForm />)

    await user.type(screen.getByLabelText('Verification code digit 1'), '123456')
    await user.click(screen.getByRole('button', { name: 'Verify code' }))

    expect(await screen.findByText('Verification failed')).toBeInTheDocument()
  })

  it('resends the code and shows the cooldown countdown', async () => {
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    resendMutateAsyncMock.mockResolvedValue({
      success: 1 as const,
      message: 'Code sent',
      result: { message: 'Code sent' },
    })

    renderWithProviders(<VerifyResetOtpForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Resend code' }))

    await waitFor(() => {
      expect(resendMutateAsyncMock).toHaveBeenCalledWith({
        email: 'user@example.com',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('You can resend the code in 2:00.')).toBeInTheDocument()
    })
  })

  it('shows resend error when resending the code fails', async () => {
    const user = userEvent.setup()
    window.sessionStorage.setItem('bazario-reset-email', 'user@example.com')
    resendMutateAsyncMock.mockRejectedValue(new Error('Unable to resend code'))

    renderWithProviders(<VerifyResetOtpForm />)

    await user.click(screen.getByRole('button', { name: 'Resend code' }))

    expect(await screen.findByText('Unable to resend code')).toBeInTheDocument()
  })
})
