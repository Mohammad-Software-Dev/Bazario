import { describe, expect, it } from 'vitest'

import { buildProductCartItem } from '@/features/products/lib/build-product-cart-item'

describe('buildProductCartItem', () => {
  it('builds a cart item snapshot from a product', () => {
    const item = buildProductCartItem({
      id: 1,
      name: { en: 'Desk Lamp', ar: 'مصباح' },
      description: { en: 'Small lamp', ar: 'مصباح صغير' },
      price: 18,
      category_id: 2,
      seller_id: 3,
      created_at: '2026-08-10T10:00:00Z',
      images: [{ id: 1, product_id: 1, image: 'lamp.jpg', image_url: '/lamp.jpg' }],
      category: { id: 2, name: { en: 'Home', ar: 'المنزل' } },
      seller: { id: 3, user_id: 7, store_name: 'Seller One', store_owner_name: 'Ali', logo: null, address: 'Berlin', description: null },
    } as never, 0)

    expect(item).toEqual(
      expect.objectContaining({
        product_id: 1,
        quantity: 1,
        name: 'Desk Lamp',
        seller_name: 'Seller One',
        category_name: 'Home',
      }),
    )
  })
})
