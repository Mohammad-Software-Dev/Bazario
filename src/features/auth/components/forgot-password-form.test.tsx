import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'
import { createApiError } from '@/test/api-error'
import { renderWithProviders } from '@/test/render-with-providers'

const navigateMock = vi.fn()
const mutateAsyncMock = vi.fn()
const useForgotPasswordMutationMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/features/auth/hooks/use-forgot-password-mutation', () => ({
  useForgotPasswordMutation: () => useForgotPasswordMutationMock(),
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    mutateAsyncMock.mockReset()
    useForgotPasswordMutationMock.mockReset()
    useForgotPasswordMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
  })

  it('shows client validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText('Email'), 'wrong@example')
    await user.click(screen.getByRole('button', { name: 'Send OTP code' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  it('calls the mutation, stores reset email, and navigates on success', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockResolvedValue({
      success: 1 as const,
      message: 'OTP sent',
      result: { message: 'OTP sent' },
    })

    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'Send OTP code' }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        email: 'user@example.com',
      })
    })

    expect(window.sessionStorage.getItem('bazario-reset-email')).toBe('user@example.com')
    expect(navigateMock).toHaveBeenCalledWith('/verify-reset-otp')
  })

  it('shows api field error for email', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockRejectedValue(
      createApiError('Unable to send OTP.', {
        email: ['No user exists for this email.'],
      }),
    )

    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'Send OTP code' }))

    expect(await screen.findByText('No user exists for this email.')).toBeInTheDocument()
    expect(screen.getByText('Unable to send OTP.')).toBeInTheDocument()
  })

  it('shows fallback server error for generic failure', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockRejectedValue(new Error('Request failed'))

    renderWithProviders(<ForgotPasswordForm />)

    await user.type(screen.getByLabelText('Email'), 'user@example.com')
    await user.click(screen.getByRole('button', { name: 'Send OTP code' }))

    expect(await screen.findByText('Request failed')).toBeInTheDocument()
  })
})
