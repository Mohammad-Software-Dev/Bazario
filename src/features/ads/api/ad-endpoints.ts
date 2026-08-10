export const adEndpoints = {
  list: '/api/ads',
  gold: '/api/ads/gold',
  silver: '/api/ads/silver',
  normal: '/api/ads/normal',
  positions: '/api/ad-positions',
  myAds: '/api/my-ads',
  create: '/api/ads',
  checkoutSession: (adId: number) => `/api/ads/${adId}/checkout-session`,
  reconcileCheckoutSession: (adId: number) => `/api/ads/${adId}/checkout-session/reconcile`,
  addImages: (adId: number) => `/api/ads/${adId}/images`,
} as const
