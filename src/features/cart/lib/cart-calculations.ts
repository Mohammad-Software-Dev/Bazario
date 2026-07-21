import type { CartItem, CartSummary, ServiceCartItem } from '@/features/cart/types/cart.types'

export function formatCartMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100)
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total) => total + 1, 0)
}

export function getProductItemCount(items: CartItem[]) {
  return items.filter((item) => item.type === 'product').reduce((total, item) => total + item.quantity, 0)
}

export function getServiceItemCount(items: CartItem[]) {
  return items.filter((item) => item.type === 'service').length
}

export function buildCartSummary(items: CartItem[], currency: 'EUR'): CartSummary {
  return {
    currency,
    item_count: getCartItemCount(items),
    product_count: getProductItemCount(items),
    service_count: getServiceItemCount(items),
    subtotal: getCartSubtotal(items),
  }
}

export function formatCartBookingWindow(item: ServiceCartItem) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: item.timezone,
  })

  const startDate = new Date(item.starts_at)
  const endDate = new Date(item.ends_at)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${item.starts_at} to ${item.ends_at}`
  }

  return `${formatter.format(startDate)} to ${formatter.format(endDate)}`
}
