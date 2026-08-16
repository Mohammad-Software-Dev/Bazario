import { describe, expect, it } from 'vitest'

import {
  buildCartSummary,
  formatCartBookingWindow,
  getCartItemCount,
  getCartSubtotal,
  getProductItemCount,
  getServiceItemCount,
} from '@/features/cart/lib/cart-calculations'
import type { CartItem, ServiceCartItem } from '@/features/cart/types/cart.types'

const items: CartItem[] = [
  {
    type: 'product',
    cart_item_id: 'product-1',
    product_id: 1,
    quantity: 2,
    name: 'Desk Lamp',
    price: 15,
    seller_name: 'Seller One',
  },
  {
    type: 'service',
    cart_item_id: 'service-1',
    service_id: 2,
    quantity: 1,
    title: 'Consultation',
    price: 40,
    provider_name: 'Provider One',
    starts_at: '2026-08-20T10:00:00Z',
    ends_at: '2026-08-20T11:00:00Z',
    timezone: 'UTC',
    location_type: 'remote',
  },
]

describe('cart calculations', () => {
  it('calculates subtotal across products and services', () => {
    expect(getCartSubtotal(items)).toBe(70)
  })

  it('counts cart items by row rather than product quantity', () => {
    expect(getCartItemCount(items)).toBe(2)
  })

  it('counts total product quantity', () => {
    expect(getProductItemCount(items)).toBe(2)
  })

  it('counts service rows', () => {
    expect(getServiceItemCount(items)).toBe(1)
  })

  it('builds the cart summary snapshot', () => {
    expect(buildCartSummary(items, 'EUR')).toEqual({
      currency: 'EUR',
      item_count: 2,
      product_count: 2,
      service_count: 1,
      subtotal: 70,
    })
  })

  it('falls back to raw values for invalid booking window dates', () => {
    const invalidItem = {
      ...items[1],
      starts_at: 'not-a-date',
      ends_at: 'still-not-a-date',
    } as ServiceCartItem

    expect(formatCartBookingWindow(invalidItem)).toBe('not-a-date - still-not-a-date')
  })
})
