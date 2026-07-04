import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'
import type { LocalizedValue } from '@/lib/localized-value'

export interface ServiceImage {
  id: number
  service_id: number
  image: string
}

export interface ServiceCategory {
  id: number
  name: LocalizedValue
}

export interface ServiceProviderUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface ServiceProviderProfile {
  id: number
  user_id: number
  name: string
  logo: string | null
  address: string
  description: string | null
  user?: ServiceProviderUser | null
}

export interface ServiceListItem {
  id: number
  title: LocalizedValue
  description: LocalizedValue
  price: number
  category_id: number
  provider_id: number
  created_at: string
  isNew?: boolean
  images: ServiceImage[]
  category: ServiceCategory | null
  serviceProvider?: ServiceProviderProfile | null
}

export type ServicesResult = LaravelPaginatedResponse<ServiceListItem>

export interface ServiceProviderServicesResult {
  service_provider: ServiceProviderProfile
  services: ServicesResult
}
