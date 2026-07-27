import { useMutation } from '@tanstack/react-query'

import { startCheckout } from '@/features/orders/api/orders-api'
import type { AddOrderItemPayload } from '@/features/orders/types/order.types'
import type { CartItem } from '@/features/cart/types/cart.types'

function mapCartItemToOrderItemPayload(item: CartItem): AddOrderItemPayload {
  if (item.type === 'product') {
    return {
      type: 'product',
      id: item.product_id,
      quantity: item.quantity,
    }
  }

  return {
    type: 'service',
    id: item.service_id,
    quantity: 1,
    starts_at: item.starts_at,
    ends_at: item.ends_at,
    timezone: item.timezone,
    location_type: item.location_type,
    location_payload: item.location_payload ?? null,
  }
}

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      return startCheckout({
        items: items.map(mapCartItemToOrderItemPayload),
      })
    },
    onSuccess: (result) => {
      window.location.assign(result.checkout_url)
    },
  })
}
