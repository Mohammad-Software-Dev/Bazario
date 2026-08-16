import { describe, expect, it } from 'vitest'

import {
  getAdTargetHref,
  mapAdToViewModel,
  normalizeAdTargetType,
  normalizeAdTier,
} from '@/features/ads/lib/ad-mappers'

describe('ad mappers', () => {
  it('normalizes backend model names into target types', () => {
    expect(normalizeAdTargetType('App\\Models\\Product')).toBe('product')
    expect(normalizeAdTargetType('Unknown')).toBeNull()
  })

  it('normalizes placement names into tiers', () => {
    expect(normalizeAdTier('golden_ad')).toBe('gold')
    expect(normalizeAdTier('weird')).toBeNull()
  })

  it('builds target hrefs from ad target type', () => {
    expect(
      getAdTargetHref({
        adable_type: 'App\\Models\\Seller',
        adable_id: 12,
      } as never),
    ).toBe('/sellers/12/products')
  })

  it('maps ad view model including refunded payment state', () => {
    const viewModel = mapAdToViewModel({
      id: 1,
      title: 'Ad title',
      subtitle: 'Ad subtitle',
      adable_type: 'App\\Models\\Product',
      adable_id: 3,
      images: [],
      price: 20,
      status: 'approved',
      paid_at: '2026-08-10T10:00:00Z',
      created_at: '2026-08-10T10:00:00Z',
      expires_at: null,
      currency_iso: 'EUR',
      position: { name: 'golden_ad' },
      adable: {
        name: { en: 'Desk Lamp', ar: 'مصباح' },
        description: { en: 'Lamp', ar: 'مصباح' },
        seller: { store_name: 'Seller One', user: { name: 'Ali' } },
      },
      refund: { applied: true, status: 'succeeded', amount: 20, stripe_refund_id: 're_1' },
    } as never)

    expect(viewModel).toEqual(
      expect.objectContaining({
        tier: 'gold',
        targetType: 'product',
        targetTitle: 'Desk Lamp',
        paymentState: 'refunded',
      }),
    )
  })
})
