import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SellersPage } from '@/features/sellers/pages/sellers-page'
import { renderWithProviders } from '@/test/render-with-providers'

vi.mock('@/features/sellers/hooks/use-sellers-query', () => ({
  useSellersQuery: vi.fn(),
}))
vi.mock('@/features/sellers/components/seller-preview-card', () => ({
  SellerPreviewCard: ({ seller }: { seller: { id: number } }) => <div>Seller {seller.id}</div>,
}))
vi.mock('@/components/shared/pagination-controls', () => ({
  PaginationControls: ({ currentPage, lastPage }: { currentPage: number; lastPage: number }) => (
    <div>
      Pagination {currentPage}/{lastPage}
    </div>
  ),
}))

const { useSellersQuery } = await import('@/features/sellers/hooks/use-sellers-query')

describe('SellersPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.mocked(useSellersQuery).mockReturnValue({ isLoading: false, isError: false, data: null } as never)
  })

  it('shows error state', () => {
    vi.mocked(useSellersQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Sellers failed'),
    } as never)
    renderWithProviders(<SellersPage />)
    expect(screen.getByText('Sellers failed')).toBeInTheDocument()
  })

  it('shows populated seller list', () => {
    vi.mocked(useSellersQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        result: {
          current_page: 1,
          last_page: 2,
          data: [{ id: 9 }],
        },
      },
    } as never)
    renderWithProviders(<SellersPage />)
    expect(screen.getByText('Seller 9')).toBeInTheDocument()
    expect(screen.getByText('Pagination 1/2')).toBeInTheDocument()
  })
})
