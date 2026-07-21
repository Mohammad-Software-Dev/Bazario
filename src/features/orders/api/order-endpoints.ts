export const orderEndpoints = {
  create: '/api/orders',
  mine: '/api/orders/my-orders',
  bookings: '/api/me/bookings',
  detail: (orderId: number) => `/api/orders/${orderId}`,
  addItem: (orderId: number) => `/api/orders/${orderId}/items`,
  checkoutSession: (orderId: number) => `/api/orders/${orderId}/checkout-session`,
  reconcileCheckoutSession: (orderId: number) => `/api/orders/${orderId}/checkout-session/reconcile`,
  cancelBooking: (bookingId: number) => `/api/bookings/${bookingId}/cancel`,
} as const
