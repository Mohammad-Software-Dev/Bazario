import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ServiceProvidersPage } from '@/features/service-providers/pages/service-providers-page'
import { renderWithProviders } from '@/test/render-with-providers'

vi.mock('@/features/service-providers/hooks/use-service-providers-query', () => ({
  useServiceProvidersQuery: vi.fn(),
}))
vi.mock('@/features/service-providers/components/service-provider-preview-card', () => ({
  ServiceProviderPreviewCard: ({ serviceProvider }: { serviceProvider: { id: number } }) => (
    <div>Provider {serviceProvider.id}</div>
  ),
}))
vi.mock('@/components/shared/pagination-controls', () => ({
  PaginationControls: ({ currentPage, lastPage }: { currentPage: number; lastPage: number }) => (
    <div>
      Pagination {currentPage}/{lastPage}
    </div>
  ),
}))

const { useServiceProvidersQuery } = await import('@/features/service-providers/hooks/use-service-providers-query')

describe('ServiceProvidersPage', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.mocked(useServiceProvidersQuery).mockReturnValue({ isLoading: false, isError: false, data: null } as never)
  })

  it('shows error state', () => {
    vi.mocked(useServiceProvidersQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Providers failed'),
    } as never)
    renderWithProviders(<ServiceProvidersPage />)
    expect(screen.getByText('Providers failed')).toBeInTheDocument()
  })

  it('shows populated provider list', () => {
    vi.mocked(useServiceProvidersQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        result: {
          current_page: 1,
          last_page: 3,
          data: [{ id: 7 }],
        },
      },
    } as never)
    renderWithProviders(<ServiceProvidersPage />)
    expect(screen.getByText('Provider 7')).toBeInTheDocument()
    expect(screen.getByText('Pagination 1/3')).toBeInTheDocument()
  })
})
