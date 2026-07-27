export const orderEndpoints = {
  startCheckout: '/api/checkout/session',
  mine: '/api/orders/my-orders',
  bookings: '/api/me/bookings',
  detail: (orderId: number) => `/api/orders/${orderId}`,
  bookingDetail: (bookingId: number) => `/api/bookings/${bookingId}`,
  checkoutSession: (orderId: number) => `/api/orders/${orderId}/checkout-session`,
  reconcileCheckoutSession: (orderId: number) => `/api/orders/${orderId}/checkout-session/reconcile`,
  cancelBooking: (bookingId: number) => `/api/bookings/${bookingId}/cancel`,
  rescheduleBooking: (bookingId: number) => `/api/bookings/${bookingId}/reschedule`,
  confirmBooking: (bookingId: number) => `/api/bookings/${bookingId}/confirm`,
  completeBooking: (bookingId: number) => `/api/bookings/${bookingId}/complete`,
} as const
