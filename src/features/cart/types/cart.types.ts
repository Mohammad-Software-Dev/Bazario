export interface CartDisplaySnapshot {
  category_name?: string
  image?: string | null
  price: number
}

export interface ProductCartItem extends CartDisplaySnapshot {
  type: 'product'
  cart_item_id: string
  product_id: number
  quantity: number
  name: string
  seller_name: string
}

export interface ServiceBookingPayload {
  starts_at: string
  ends_at: string
  timezone: string
  location_type: string
  location_payload?: Record<string, unknown> | null
}

export interface ServiceCartItem extends CartDisplaySnapshot, ServiceBookingPayload {
  type: 'service'
  cart_item_id: string
  service_id: number
  quantity: 1
  title: string
  provider_name: string
  duration_minutes?: number | null
}

export type CartItem = ProductCartItem | ServiceCartItem

export interface AddProductToCartInput extends CartDisplaySnapshot {
  product_id: number
  quantity: number
  name: string
  seller_name: string
}

export interface AddServiceToCartInput extends CartDisplaySnapshot, ServiceBookingPayload {
  service_id: number
  title: string
  provider_name: string
  duration_minutes?: number | null
}

export interface CartSummary {
  currency: 'EUR'
  item_count: number
  product_count: number
  service_count: number
  subtotal: number
}
