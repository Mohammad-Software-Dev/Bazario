import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

export interface SellerUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface SellerListItem {
  id: number
  user_id: number
  store_owner_name: string
  store_name: string
  address: string
  logo: string | null
  description: string | null
  created_at: string
  user?: SellerUser | null
}

export type SellersResult = LaravelPaginatedResponse<SellerListItem>
