import type { Role, User } from '@/features/auth/types/auth.types'

export interface AvailableUpgrades {
  seller: boolean
  service_provider: boolean
}

export interface SellerProfile {
  id: number
  user_id: number
  store_owner_name: string
  store_name: string
  address: string
  logo: string | null
  description: string | null
  status: string
  created_at?: string
  updated_at?: string
}

export interface ServiceProviderProfile {
  id: number
  user_id: number
  name: string
  address: string
  logo: string | null
  description: string | null
  status: string
  created_at?: string
  updated_at?: string
}

export interface AccountSummaryCounts {
  orders: number
  bookings: number
  sales: number
  provider_bookings: number
}

export interface RecentOrderItem {
  id: number
  title_snapshot: string
  quantity: number
  unit_amount: number
  status: string
}

export interface RecentOrder {
  id: number
  status: string
  currency_iso: string
  total_amount: number
  placed_at: string
  paid_at: string | null
  items: RecentOrderItem[]
}

export interface RecentBookingService {
  id: number
  title: string
  price: string
}

export interface RecentBookingUser {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface RecentBooking {
  id: number
  status: string
  starts_at: string
  ends_at: string
  service: RecentBookingService
  provider_user: RecentBookingUser
}

export interface RecentSaleItem {
  id: number
  title_snapshot: string
  gross_amount: number
  net_amount: number
  status: string
}

export interface RecentProviderBooking {
  id: number
  status: string
  starts_at: string
  ends_at: string
  service: RecentBookingService
  customer_user: RecentBookingUser
}

export interface MeResult {
  user: User & {
    roles?: Role[]
    seller_profile?: SellerProfile | null
    service_provider_profile?: ServiceProviderProfile | null
    available_upgrades?: AvailableUpgrades
  }
  counts?: AccountSummaryCounts
  recent_orders?: RecentOrder[]
  recent_bookings?: RecentBooking[]
  recent_sales?: RecentSaleItem[]
  recent_provider_bookings?: RecentProviderBooking[]
}

export interface UpgradeToSellerPayload {
  store_owner_name: string
  store_name: string
  address: string
  description?: string
  email?: string
  phone?: string
  logo?: FileList | null
  attachments?: FileList | null
}

export interface UpgradeToServiceProviderPayload {
  name: string
  address: string
  description?: string
  email?: string
  phone?: string
  logo?: FileList | null
  attachments?: FileList | null
}

export interface UpgradeToSellerResult {
  user: User
  seller: SellerProfile
}

export interface UpgradeToServiceProviderResult {
  user: User
  service_provider: ServiceProviderProfile
}
