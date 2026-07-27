import { httpClient } from '@/lib/api/http-client'

import { orderEndpoints } from '@/features/orders/api/order-endpoints'
import type {
  BookingDetailResult,
  BookingsResult,
  CancelBookingResult,
  CreateCheckoutSessionResult,
  OrderRecord,
  OrdersResult,
  ReconcileCheckoutSessionPayload,
  ReconcileCheckoutSessionResult,
  RescheduleBookingPayload,
  StartCheckoutPayload,
} from '@/features/orders/types/order.types'

export async function startCheckout(payload: StartCheckoutPayload) {
  const response = await httpClient.post<CreateCheckoutSessionResult>(orderEndpoints.startCheckout, payload)

  return response.data
}

export async function createCheckoutSession(orderId: number) {
  const response = await httpClient.post<CreateCheckoutSessionResult>(orderEndpoints.checkoutSession(orderId))

  return response.data
}

export async function reconcileCheckoutSession(orderId: number, payload: ReconcileCheckoutSessionPayload) {
  const response = await httpClient.post<ReconcileCheckoutSessionResult>(
    orderEndpoints.reconcileCheckoutSession(orderId),
    payload,
  )

  return response.data
}

export async function getMyOrders(page = 1) {
  const response = await httpClient.get<OrdersResult>(orderEndpoints.mine, {
    params: { page },
  })

  return response.data
}

export async function getOrder(orderId: number) {
  const response = await httpClient.get<OrderRecord>(orderEndpoints.detail(orderId))

  return response.data
}

export async function getMyBookings(page = 1) {
  const response = await httpClient.get<BookingsResult>(orderEndpoints.bookings, {
    params: { page },
  })

  return response.data
}

export async function getBooking(bookingId: number) {
  const response = await httpClient.get<BookingDetailResult>(orderEndpoints.bookingDetail(bookingId))

  return response.data
}

export async function cancelBooking(bookingId: number, reason?: string) {
  const response = await httpClient.patch<CancelBookingResult>(orderEndpoints.cancelBooking(bookingId), {
    reason,
  })

  return response.data
}

export async function rescheduleBooking(bookingId: number, payload: RescheduleBookingPayload) {
  const response = await httpClient.patch<BookingDetailResult>(orderEndpoints.rescheduleBooking(bookingId), payload)

  return response.data
}
