export const listingEndpoints = {
  list: '/api/listings',
  myListings: '/api/my-listings',
  create: '/api/listings',
  pricing: '/api/listing-pricing',
  checkoutSession: (listingId: number) => `/api/listings/${listingId}/checkout-session`,
  reconcileCheckoutSession: (listingId: number) => `/api/listings/${listingId}/checkout-session/reconcile`,
} as const
