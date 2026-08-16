import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginForm } from '@/features/auth/components/login-form'
import { renderWithProviders } from '@/test/render-with-providers'
import { createApiError } from '@/test/api-error'
import type { LoginResult } from '@/features/auth/types/auth.types'

const navigateMock = vi.fn()
const setSessionMock = vi.fn()
const mutateAsyncMock = vi.fn()
const useLoginMutationMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/features/auth/hooks/use-login-mutation', () => ({
  useLoginMutation: () => useLoginMutationMock(),
}))

vi.mock('@/lib/auth/use-auth', () => ({
  useAuth: () => ({
    setSession: setSessionMock,
  }),
}))

function buildLoginResponse(roles: LoginResult['roles'] = ['customer']) {
  return {
    success: 1 as const,
    message: 'Logged in',
    result: {
      token: 'token-123',
      roles,
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: null,
        age: null,
      },
    },
  }
}

describe('LoginForm', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    setSessionMock.mockReset()
    mutateAsyncMock.mockReset()
    useLoginMutationMock.mockReset()
    useLoginMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    })
  })

  it('renders required inputs and submit button', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows client validation errors for empty submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  it('submits valid credentials and stores session on success', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mutateAsyncMock.mockResolvedValue(buildLoginResponse())

    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'secret123',
      })
    })

    expect(setSessionMock).toHaveBeenCalledWith({
      token: 'token-123',
      roles: ['customer'],
      user: expect.objectContaining({
        email: 'test@example.com',
      }),
    })
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('blocks admin login without storing session', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockResolvedValue(buildLoginResponse(['admin']))

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Admin accounts must sign in through the backend dashboard only.')).toBeInTheDocument()
    expect(setSessionMock).not.toHaveBeenCalled()
  })

  it('shows api field errors for email and password', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockRejectedValue(
      createApiError('Invalid credentials.', {
        email: ['Email is unknown.'],
        password: ['Password is incorrect.'],
      }),
    )

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Email is unknown.')).toBeInTheDocument()
    expect(screen.getByText('Password is incorrect.')).toBeInTheDocument()
    expect(screen.getByText('Invalid credentials.')).toBeInTheDocument()
  })

  it('shows fallback server error for generic failure', async () => {
    const user = userEvent.setup()
    mutateAsyncMock.mockRejectedValue(new Error('Network unavailable'))

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Network unavailable')).toBeInTheDocument()
  })

  it('navigates to forgot-password when the link is clicked', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: 'Forgot your password?' }))

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/forgot-password')
  })

  it('navigates to register when the register action is clicked', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/register')
  })
})
