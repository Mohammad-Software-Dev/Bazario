import { beforeEach, describe, expect, it } from 'vitest'

import { useCartStore } from '@/stores/cart-store'

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      currency: 'EUR',
      ownerType: 'guest',
      ownerId: null,
    })
  })

  it('adds and merges product items by product id', () => {
    useCartStore.getState().addProductItem({
      product_id: 1,
      quantity: 1,
      name: 'Desk Lamp',
      price: 15,
      seller_name: 'Seller One',
    })
    useCartStore.getState().addProductItem({
      product_id: 1,
      quantity: 2,
      name: 'Desk Lamp',
      price: 15,
      seller_name: 'Seller One',
    })

    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ type: 'product', quantity: 3 })
  })

  it('does not add duplicate service bookings with identical windows', () => {
    const payload = {
      service_id: 2,
      title: 'Consultation',
      price: 40,
      provider_name: 'Provider One',
      starts_at: '2026-08-20T10:00:00Z',
      ends_at: '2026-08-20T11:00:00Z',
      timezone: 'UTC',
      location_type: 'remote',
    }

    useCartStore.getState().addServiceItem(payload)
    useCartStore.getState().addServiceItem(payload)

    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('updates product quantity and removes row when quantity becomes zero', () => {
    useCartStore.getState().addProductItem({
      product_id: 1,
      quantity: 2,
      name: 'Desk Lamp',
      price: 15,
      seller_name: 'Seller One',
    })

    const cartItemId = useCartStore.getState().items[0].cart_item_id
    useCartStore.getState().updateProductQuantity(cartItemId, 4)
    expect(useCartStore.getState().items[0]).toMatchObject({ quantity: 4 })

    useCartStore.getState().updateProductQuantity(cartItemId, 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears the cart when owner changes from one user to another', () => {
    useCartStore.getState().addProductItem({
      product_id: 1,
      quantity: 1,
      name: 'Desk Lamp',
      price: 15,
      seller_name: 'Seller One',
    })

    useCartStore.getState().syncOwner(5)
    expect(useCartStore.getState().items).toHaveLength(1)

    useCartStore.getState().syncOwner(7)
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().ownerId).toBe(7)
  })
})
