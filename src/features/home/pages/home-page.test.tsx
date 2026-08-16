import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HomePage } from '@/features/home/pages/home-page'
import { renderWithProviders } from '@/test/render-with-providers'

vi.mock('@/features/home/hooks/use-home-query', () => ({
  useHomeQuery: vi.fn(),
}))
vi.mock('@/features/ads/components/ads-section', () => ({
  AdsSection: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))
vi.mock('@/features/ads/components/sponsored-ads-carousel', () => ({
  SponsoredAdsCarousel: ({ ads }: { ads: unknown[] }) => <div>Ads carousel {ads.length}</div>,
}))
vi.mock('@/features/listings/components/marketplace-updates-carousel', () => ({
  MarketplaceUpdatesCarousel: ({ listings }: { listings: unknown[] }) => <div>Listings carousel {listings.length}</div>,
}))
vi.mock('@/features/products/components/product-preview-card', () => ({
  ProductPreviewCard: ({ product }: { product: { id: number } }) => <div>Product {product.id}</div>,
}))
vi.mock('@/features/services/components/service-preview-card', () => ({
  ServicePreviewCard: ({ service }: { service: { id: number } }) => <div>Service {service.id}</div>,
}))

const { useHomeQuery } = await import('@/features/home/hooks/use-home-query')

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useHomeQuery).mockReturnValue({ isLoading: false, isError: false, data: null } as never)
  })

  it('shows loading skeleton state', () => {
    vi.mocked(useHomeQuery).mockReturnValue({ isLoading: true, isError: false } as never)
    renderWithProviders(<HomePage />)
    expect(document.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('shows error state', () => {
    vi.mocked(useHomeQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error('Home failed'),
    } as never)
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Home failed')).toBeInTheDocument()
  })

  it('renders populated sections', () => {
    vi.mocked(useHomeQuery).mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        result: {
          products: { latest: [{ id: 1 }] },
          services: { latest: [{ id: 2 }] },
          ads: {
            gold: [{ id: 1, images: [], title: 'Gold ad', subtitle: null, adable_type: null, adable_id: null, price: null, status: 'approved', paid_at: null, created_at: '2026-08-10T10:00:00Z', expires_at: null, position: null, adable: null }],
            silver: [],
            normal: [],
            announcements: [{ id: 3, title: 'Announcement', images: [], coverImage: null, user: null }],
          },
        },
      },
    } as never)
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Listings carousel 1')).toBeInTheDocument()
    expect(screen.getByText('Ads carousel 1')).toBeInTheDocument()
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Service 2')).toBeInTheDocument()
  })
})
