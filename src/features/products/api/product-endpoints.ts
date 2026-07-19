export const productEndpoints = {
  list: '/api/products',
  myList: '/api/my-products',
  create: '/api/product',
  detail: (productId: number) => `/api/products/${productId}`,
  update: (productId: number) => `/api/product/${productId}`,
  delete: (productId: number) => `/api/product/${productId}`,
  bySeller: (sellerId: number) => `/api/seller/${sellerId}/products`,
} as const
