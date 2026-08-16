export const adEndpoints = {
  positions: "/api/ad-positions",
  myAds: "/api/my-ads",
  create: "/api/ads",
  delete: (adId: number) => `/api/ads/${adId}`,
  checkoutSession: (adId: number) => `/api/ads/${adId}/checkout-session`,
  reconcileCheckoutSession: (adId: number) =>
    `/api/ads/${adId}/checkout-session/reconcile`,
} as const;
