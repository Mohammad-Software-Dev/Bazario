import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OrdersPage } from '@/features/orders/pages/orders-page'
import { renderWithProviders } from '@/test/render-with-providers'

vi.mock('@/features/orders/hooks/use-my-orders-query', () => ({
  useMyOrdersQuery: vi.fn(),
}))

vi.mock('@/features/orders/components/order-list-card', () => ({
  OrderListCard: ({ order }: { order: { id: number } }) => <div>Order row {order.id}</div>,
}))

vi.mock('@/components/shared/pagination-controls', () => ({
  PaginationControls: ({ currentPage, lastPage }: { currentPage: number; lastPage: number }) => (
    <div>
      Pagination {currentPage}/{lastPage}
    </div>
  ),
}))

const { useMyOrdersQuery } = await import('@/features/orders/hooks/use-my-orders-query')

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.mocked(useMyOrdersQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: null,
      error: null,
    } as never)
  })

  it('shows loading state', () => {
    vi.mocked(useMyOrdersQuery).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    } as never)

    renderWithProviders(<OrdersPage />)

    expect(screen.getByText('Loading orders...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useMyOrdersQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: new Error('Orders failed'),
    } as never)

    renderWithProviders(<OrdersPage />)

    expect(screen.getByText('Orders failed')).toBeInTheDocument()
  })

  it('shows empty state and pagination when there are no orders', () => {
    vi.mocked(useMyOrdersQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        total: 0,
        current_page: 1,
        last_page: 1,
        data: [],
      },
    } as never)

    renderWithProviders(<OrdersPage />)

    expect(screen.getByText('No orders yet. Once you buy a product or complete a service checkout, it will appear here.')).toBeInTheDocument()
    expect(screen.getByText('Pagination 1/1')).toBeInTheDocument()
  })

  it('renders populated orders', () => {
    vi.mocked(useMyOrdersQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        total: 1,
        current_page: 1,
        last_page: 2,
        data: [{ id: 22 }],
      },
    } as never)

    renderWithProviders(<OrdersPage />)

    expect(screen.getByText('Order row 22')).toBeInTheDocument()
    expect(screen.getByText('Pagination 1/2')).toBeInTheDocument()
  })
})
