import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'
import type { LocalizedValue } from '@/lib/localized-value'

export type OrderStatus = 'draft' | 'requires_payment' | 'paid' | 'partially_refunded' | 'refunded'
export type OrderItemStatus = 'pending' | 'fulfilled' | 'cancelled' | 'refunded'
export type BookingStatus =
  | 'requested'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled_by_customer'
  | 'cancelled_by_provider'

export interface StripePaymentRecord {
  id: number
  order_id: number
  payment_intent_id: string
  status: string | null
  charge_id: string | null
  amount: number
  currency_iso: string
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
}

export interface StripeRefundRecord {
  id: number
  order_id: number
  order_item_id: number | null
  service_booking_id: number | null
  stripe_payment_id: number | null
  payment_intent_id: string | null
  charge_id: string | null
  stripe_refund_id: string
  amount: number
  currency_iso: string
  status: string | null
  reason: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
}

export interface OrderServiceBooking {
  id: number
  order_item_id: number | null
  service_id: number
  provider_user_id: number
  customer_user_id: number
  status: BookingStatus
  starts_at: string
  ends_at: string
  timezone: string | null
  location_type: string | null
  location_payload?: Record<string, unknown> | null
  cancelled_at?: string | null
  cancellation_reason?: string | null
}

export interface OrderItemRecord {
  id: number
  order_id: number
  purchasable_type: string
  purchasable_id: number
  title_snapshot: string | null
  description_snapshot: string | null
  quantity: number
  unit_amount: number
  gross_amount: number
  platform_fee_amount: number
  net_amount: number
  payee_user_id: number
  status: OrderItemStatus
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  service_booking?: OrderServiceBooking | null
  stripe_refunds?: StripeRefundRecord[]
}

export interface OrderRecord {
  id: number
  buyer_id: number
  status: OrderStatus
  currency_iso: string
  subtotal_amount: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  transfer_group?: string | null
  placed_at?: string | null
  paid_at?: string | null
  cancelled_at?: string | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
  items: OrderItemRecord[]
  stripe_payment?: StripePaymentRecord | null
  stripe_refunds?: StripeRefundRecord[]
}

export interface BookingServiceSummary {
  id: number
  title: LocalizedValue | string
  price?: number | string
}

export interface BookingUserSummary {
  id: number
  name: string
  email?: string | null
  phone?: string | null
}

export interface CustomerBookingRecord {
  id: number
  order_item_id: number | null
  service_id: number
  provider_user_id: number
  customer_user_id: number
  status: BookingStatus
  starts_at: string
  ends_at: string
  timezone: string | null
  location_type?: string | null
  location_payload?: Record<string, unknown> | null
  cancelled_at?: string | null
  cancellation_reason?: string | null
  service: BookingServiceSummary
  provider_user?: BookingUserSummary | null
  customer_user?: BookingUserSummary | null
  order_item?: OrderItemRecord | null
}

export type OrdersResult = LaravelPaginatedResponse<OrderRecord>
export type BookingsResult = LaravelPaginatedResponse<CustomerBookingRecord>
export type CreateOrderResult = OrderRecord

export interface ProductOrderItemPayload {
  type: 'product'
  id: number
  quantity: number
}

export interface ServiceOrderItemPayload {
  type: 'service'
  id: number
  quantity: 1
  starts_at: string
  ends_at: string
  timezone: string
  location_type: string
  location_payload?: Record<string, unknown> | null
}

export type AddOrderItemPayload = ProductOrderItemPayload | ServiceOrderItemPayload

export interface CreateCheckoutSessionResult {
  checkout_url: string
  checkout_session_id: string
  order_id: number
  status: OrderStatus
}

export interface ReconcileCheckoutSessionPayload {
  session_id: string
}

export interface ReconcileCheckoutSessionResult {
  order: OrderRecord
  payment: StripePaymentRecord | null
  is_paid: boolean
}

export interface CancelBookingRefundResult {
  applied: boolean
  amount: number | null
  status: string | null
  stripe_refund_id: string | null
}

export interface CancelBookingResult {
  booking: CustomerBookingRecord
  refund: CancelBookingRefundResult
  order_status: OrderStatus | null
}
