import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'
import type { LocalizedValue } from '@/lib/localized-value'

export interface LocalizedTextFields {
  en?: string | null
  ar?: string | null
}

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
  title_translations?: LocalizedTextFields | null
  description_translations?: LocalizedTextFields | null
  price: number
  category_id: number
  provider_id: number
  created_at: string
  isNew?: boolean
  duration_minutes?: number | null
  location_type?: string | null
  is_active?: boolean | null
  max_concurrent_bookings?: number | null
  slot_interval_minutes?: number | null
  cancel_cutoff_hours?: number | null
  edit_cutoff_hours?: number | null
  cancel_late_policy?: 'deny' | 'allow' | null
  edit_late_policy?: 'deny' | 'allow' | null
  images: ServiceImage[]
  category: ServiceCategory | null
  serviceProvider?: ServiceProviderProfile | null
  service_provider?: ServiceProviderProfile | null
}

export type ServicesResult = LaravelPaginatedResponse<ServiceListItem>

export type MyServicesResult = LaravelPaginatedResponse<ServiceListItem>

export interface ServiceProviderServicesResult {
  service_provider: ServiceProviderProfile
  services: ServicesResult
}

export interface ServiceAvailabilitySlot {
  starts_at: string
  ends_at: string
  remaining_capacity: number
}

export interface ServiceAvailabilityResult {
  date: string
  timezone: string
  duration_minutes: number
  slot_interval_minutes: number
  capacity: number
  slots: ServiceAvailabilitySlot[]
}
