import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ConnectAccountPage } from '@/features/connect/pages/connect-account-page'
import { renderWithProviders } from '@/test/render-with-providers'

const mutateAsyncMock = vi.fn()
vi.mock('@/features/connect/hooks/use-connect-status-query', () => ({
  useConnectStatusQuery: vi.fn(),
}))
vi.mock('@/features/connect/hooks/use-start-connect-onboarding-mutation', () => ({
  useStartConnectOnboardingMutation: vi.fn(),
}))

const { useConnectStatusQuery } = await import('@/features/connect/hooks/use-connect-status-query')
const { useStartConnectOnboardingMutation } = await import('@/features/connect/hooks/use-start-connect-onboarding-mutation')

describe('ConnectAccountPage', () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset()
    vi.mocked(useStartConnectOnboardingMutation).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      isError: false,
      error: null,
    } as never)
  })

  it('shows loading state', () => {
    vi.mocked(useConnectStatusQuery).mockReturnValue({ isLoading: true, isError: false } as never)

    renderWithProviders(<ConnectAccountPage />)

    expect(screen.getByText('Loading Stripe account...')).toBeInTheDocument()
  })

  it('shows disconnected eligible state', () => {
    vi.mocked(useConnectStatusQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { eligible: true, eligible_type: 'seller', connected: false, account: null },
    } as never)

    renderWithProviders(<ConnectAccountPage />)

    expect(screen.getByRole('button', { name: 'Connect Stripe' })).toBeInTheDocument()
  })

  it('starts onboarding and redirects when action is clicked', async () => {
    const user = userEvent.setup()
    const assignMock = vi.fn()
    vi.mocked(useConnectStatusQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { eligible: true, eligible_type: 'seller', connected: false, account: null },
    } as never)
    mutateAsyncMock.mockResolvedValue({ onboarding_url: 'https://stripe.test/onboarding' })

    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, assign: assignMock },
    })

    renderWithProviders(<ConnectAccountPage />)
    await user.click(screen.getByRole('button', { name: 'Connect Stripe' }))

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1)
    expect(assignMock).toHaveBeenCalledWith('https://stripe.test/onboarding')

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })
})
