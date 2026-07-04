import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

export interface ServiceProviderUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface ServiceProviderListItem {
  id: number
  user_id: number
  name: string
  address: string
  logo: string | null
  description: string | null
  created_at: string
  user?: ServiceProviderUser | null
}

export type ServiceProvidersResult = LaravelPaginatedResponse<ServiceProviderListItem>
