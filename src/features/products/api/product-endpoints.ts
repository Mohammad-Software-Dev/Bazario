export const productEndpoints = {
  list: '/api/products',
  detail: (productId: number) => `/api/products/${productId}`,
  bySeller: (sellerId: number) => `/api/seller/${sellerId}/products`,
} as const
