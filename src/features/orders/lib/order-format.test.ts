import { describe, expect, it } from 'vitest'

import {
  formatOrderDate,
  getBookingLocalDateValue,
  getBookingPrimaryProviderName,
  getLatestRefund,
  getOrderItemDisplayTitle,
  getOrderPrimaryDate,
  isSameBookingWindow,
} from '@/features/orders/lib/order-format'

describe('order format helpers', () => {
  it('falls back to N/A when order date is missing', () => {
    expect(formatOrderDate()).toBe('N/A')
  })

  it('uses fallback text when order item title snapshot is missing', () => {
    expect(
      getOrderItemDisplayTitle({
        title_snapshot: null,
      } as never),
    ).toBe('No items added yet.')
  })

  it('returns the newest refund entry', () => {
    const refund = getLatestRefund({
      stripe_refunds: [
        { id: 1, created_at: '2026-08-10T10:00:00Z' },
        { id: 2, created_at: '2026-08-12T10:00:00Z' },
      ] as never,
    })

    expect(refund?.id).toBe(2)
  })

  it('returns the primary date with paid_at precedence', () => {
    expect(
      getOrderPrimaryDate({
        paid_at: '2026-08-12T10:00:00Z',
        placed_at: '2026-08-11T10:00:00Z',
        created_at: '2026-08-10T10:00:00Z',
      } as never),
    ).toBe('2026-08-12T10:00:00Z')
  })

  it('falls back to independent provider when provider name is missing', () => {
    expect(
      getBookingPrimaryProviderName({
        provider_user: null,
      } as never),
    ).toBe('Independent provider')
  })

  it('compares booking windows precisely', () => {
    expect(
      isSameBookingWindow(
        {
          starts_at: '2026-08-20T10:00:00Z',
          ends_at: '2026-08-20T11:00:00Z',
        },
        '2026-08-20T10:00:00Z',
        '2026-08-20T11:00:00Z',
      ),
    ).toBe(true)
  })

  it('returns a locale-independent booking date for the API and date picker', () => {
    expect(
      getBookingLocalDateValue({
        starts_at: '2026-08-20T23:30:00Z',
        timezone: 'Europe/Berlin',
      }),
    ).toBe('2026-08-21')

    expect(
      getBookingLocalDateValue({
        starts_at: '2026-08-20T23:30:00Z',
        timezone: 'Asia/Riyadh',
      }),
    ).toBe('2026-08-21')
  })
})
