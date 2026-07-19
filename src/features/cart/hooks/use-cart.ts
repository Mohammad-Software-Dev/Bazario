import { useMemo } from 'react'

import { buildCartSummary } from '@/features/cart/lib/cart-calculations'
import { useCartStore } from '@/stores/cart-store'

export function useCartItems() {
  return useCartStore((state) => state.items)
}

export function useCartSummary() {
  const items = useCartStore((state) => state.items)
  const currency = useCartStore((state) => state.currency)

  return useMemo(() => buildCartSummary(items, currency), [items, currency])
}

export function useCartActions() {
  const addProductItem = useCartStore((state) => state.addProductItem)
  const addServiceItem = useCartStore((state) => state.addServiceItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity)

  return useMemo(
    () => ({
      addProductItem,
      addServiceItem,
      clearCart,
      removeItem,
      updateProductQuantity,
    }),
    [addProductItem, addServiceItem, clearCart, removeItem, updateProductQuantity],
  )
}

export function useCartCount() {
  return useCartStore((state) => state.getItemCount())
}
