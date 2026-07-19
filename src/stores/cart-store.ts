import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  buildCartSummary,
  getCartItemCount,
  getCartSubtotal,
  getProductItemCount,
  getServiceItemCount,
} from '@/features/cart/lib/cart-calculations'
import type {
  AddProductToCartInput,
  AddServiceToCartInput,
  CartItem,
  CartSummary,
  ProductCartItem,
  ServiceCartItem,
} from '@/features/cart/types/cart.types'

interface CartStoreState {
  items: CartItem[]
  currency: 'EUR'
  addProductItem: (input: AddProductToCartInput) => void
  addServiceItem: (input: AddServiceToCartInput) => void
  updateProductQuantity: (cartItemId: string, quantity: number) => void
  removeItem: (cartItemId: string) => void
  clearCart: () => void
  replaceItems: (items: CartItem[]) => void
  getSubtotal: () => number
  getItemCount: () => number
  getProductItems: () => ProductCartItem[]
  getServiceItems: () => ServiceCartItem[]
  getProductItemCount: () => number
  getServiceItemCount: () => number
  getSummary: () => CartSummary
}

function createCartItemId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function isSameServiceBooking(left: ServiceCartItem, right: AddServiceToCartInput) {
  return (
    left.service_id === right.service_id &&
    left.starts_at === right.starts_at &&
    left.ends_at === right.ends_at &&
    left.timezone === right.timezone &&
    left.location_type === right.location_type &&
    JSON.stringify(left.location_payload ?? null) === JSON.stringify(right.location_payload ?? null)
  )
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'EUR',
      addProductItem: (input) => {
        if (input.quantity < 1) {
          return
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.type === 'product' && item.product_id === input.product_id,
          )

          if (!existingItem || existingItem.type !== 'product') {
            return {
              items: [
                ...state.items,
                {
                  type: 'product',
                  cart_item_id: createCartItemId(),
                  product_id: input.product_id,
                  quantity: input.quantity,
                  name: input.name,
                  image: input.image,
                  price: input.price,
                  seller_name: input.seller_name,
                  category_name: input.category_name,
                },
              ],
            }
          }

          return {
            items: state.items.map((item) =>
              item.cart_item_id === existingItem.cart_item_id && item.type === 'product'
                ? { ...item, quantity: item.quantity + input.quantity }
                : item,
            ),
          }
        })
      },
      addServiceItem: (input) => {
        if (!input.starts_at || !input.ends_at) {
          return
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.type === 'service' && isSameServiceBooking(item, input),
          )

          if (existingItem) {
            return state
          }

          return {
            items: [
              ...state.items,
              {
                type: 'service',
                cart_item_id: createCartItemId(),
                service_id: input.service_id,
                quantity: 1,
                title: input.title,
                image: input.image,
                price: input.price,
                provider_name: input.provider_name,
                category_name: input.category_name,
                duration_minutes: input.duration_minutes,
                starts_at: input.starts_at,
                ends_at: input.ends_at,
                timezone: input.timezone,
                location_type: input.location_type,
                location_payload: input.location_payload ?? null,
              },
            ],
          }
        })
      },
      updateProductQuantity: (cartItemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.cart_item_id !== cartItemId),
            }
          }

          return {
            items: state.items.map((item) =>
              item.cart_item_id === cartItemId && item.type === 'product'
                ? { ...item, quantity }
                : item,
            ),
          }
        })
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cart_item_id !== cartItemId),
        }))
      },
      clearCart: () => {
        set({ items: [] })
      },
      replaceItems: (items) => {
        set({ items })
      },
      getSubtotal: () => getCartSubtotal(get().items),
      getItemCount: () => getCartItemCount(get().items),
      getProductItems: () => get().items.filter((item): item is ProductCartItem => item.type === 'product'),
      getServiceItems: () => get().items.filter((item): item is ServiceCartItem => item.type === 'service'),
      getProductItemCount: () => getProductItemCount(get().items),
      getServiceItemCount: () => getServiceItemCount(get().items),
      getSummary: () => buildCartSummary(get().items, get().currency),
    }),
    {
      name: 'bazario-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
      }),
    },
  ),
)
