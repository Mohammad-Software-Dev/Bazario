import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'
import type { LocalizedValue } from '@/lib/localized-value'

export interface ProductImage {
  id: number
  product_id: number
  image: string
}

export interface ProductCategory {
  id: number
  name: LocalizedValue
}

export interface ProductSellerUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface ProductSeller {
  id: number
  user_id: number
  store_name: string
  store_owner_name: string
  logo: string | null
  address: string
  description: string | null
  user?: ProductSellerUser | null
}

export interface ProductListItem {
  id: number
  name: LocalizedValue
  description: LocalizedValue
  price: number
  category_id: number
  seller_id: number
  created_at: string
  isNew?: boolean
  images: ProductImage[]
  category: ProductCategory | null
  seller?: ProductSeller | null
}

export type ProductsResult = LaravelPaginatedResponse<ProductListItem>
