import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EarningsPage } from '@/features/earnings/pages/earnings-page'
import { renderWithProviders } from '@/test/render-with-providers'

vi.mock('@/features/connect/hooks/use-connect-summary-query', () => ({
  useConnectSummaryQuery: vi.fn(),
}))
vi.mock('@/features/earnings/components/balance-list', () => ({
  BalanceList: ({ rows }: { rows: unknown[] }) => <div>Balance rows {rows.length}</div>,
}))
vi.mock('@/features/earnings/components/transfer-list', () => ({
  TransferList: ({ transfers }: { transfers: unknown[] }) => <div>Transfers {transfers.length}</div>,
}))

const { useConnectSummaryQuery } = await import('@/features/connect/hooks/use-connect-summary-query')

describe('EarningsPage', () => {
  beforeEach(() => {
    vi.mocked(useConnectSummaryQuery).mockReturnValue({ isLoading: false, isError: false, data: null } as never)
  })

  it('shows loading state', () => {
    vi.mocked(useConnectSummaryQuery).mockReturnValue({ isLoading: true, isError: false } as never)
    renderWithProviders(<EarningsPage />)
    expect(screen.getByText('Loading earnings...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useConnectSummaryQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Summary failed'),
    } as never)
    renderWithProviders(<EarningsPage />)
    expect(screen.getByText('Summary failed')).toBeInTheDocument()
  })

  it('renders balances and connect hint when not connected', () => {
    vi.mocked(useConnectSummaryQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        eligible_type: 'seller',
        connected: false,
        account: null,
        stripe_balance: { available: [], pending: [] },
        platform_pending_balance: [],
        transfers: [],
      },
    } as never)
    renderWithProviders(<EarningsPage />)
    expect(screen.getAllByText('Balance rows 0')).toHaveLength(3)
    expect(screen.getByText('Transfers 0')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to Stripe account' })).toBeInTheDocument()
  })
})
