export const listingEndpoints = {
  myListings: '/api/my-listings',
  create: '/api/listings',
  delete: (listingId: number) => `/api/listings/${listingId}`,
  pricing: '/api/listing-pricing',
  checkoutSession: (listingId: number) => `/api/listings/${listingId}/checkout-session`,
  reconcileCheckoutSession: (listingId: number) => `/api/listings/${listingId}/checkout-session/reconcile`,
} as const
