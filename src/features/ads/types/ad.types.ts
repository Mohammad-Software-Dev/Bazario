import type { ApiSuccessResponse } from '@/lib/api/api-error'
import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

import type { ProductListItem } from '@/features/products/types/product.types'
import type { SellerListItem } from '@/features/sellers/types/seller.types'
import type { ServiceProviderListItem } from '@/features/service-providers/types/service-provider.types'
import type { ServiceListItem } from '@/features/services/types/service.types'
import type { ListingRecord } from '@/features/listings/types/listing.types'

export type AdTier = 'gold' | 'silver' | 'normal'
export type AdTargetType = 'product' | 'service' | 'seller' | 'service_provider'

export interface AdImage {
  id: number
  ad_id: number
  image_url: string
  sort_order: number
}

export interface AdPosition {
  id: number
  name: string
  label: string
  priority: number
  tier: AdTier | null
  price: number | null
  currency_iso: string
}

export type AdTarget =
  | ProductListItem
  | ServiceListItem
  | SellerListItem
  | ServiceProviderListItem
  | null

export interface Ad {
  id: number
  title: string
  subtitle: string | null
  expires_at: string | null
  price: number | string | null
  adable_type: string | null
  adable_id: number | null
  ad_position_id: number | null
  status: 'pending' | 'pending_payment' | 'pending_review' | 'approved' | 'rejected' | 'expired' | string
  paid_at: string | null
  refund_status?: string | null
  currency_iso?: string | null
  refund?: {
    applied: boolean
    status: string | null
    amount: number | null
    stripe_refund_id: string | null
  }
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  images: AdImage[]
  position: AdPosition | null
  adable: AdTarget
}

export interface AdViewModel {
  id: number
  title: string
  subtitle: string | null
  tier: AdTier | null
  targetType: AdTargetType | null
  image: string | null
  targetTitle: string
  targetDescription: string | null
  ownerName: string | null
  href: string | null
  price: string | null
  status: Ad['status']
  paymentState: 'paid' | 'payment_required'
  refundStatus: string | null
  refundAmount: string | null
  expiresAt: string | null
  createdAt: string
}

export interface HomeAdsResult {
  gold: Ad[]
  silver: Ad[]
  normal: Ad[]
  announcements: ListingRecord[]
}

export type AdsResult = LaravelPaginatedResponse<Ad>
export type MyAdsResponse = ApiSuccessResponse<AdsResult>
export type AdPositionsResponse = ApiSuccessResponse<AdPosition[]>

export interface CreateAdPayload {
  title: string
  subtitle?: string
  expires_at?: string
  ad_position_id: number
  adable_type: AdTargetType
  adable_id?: number | null
  images?: FileList | null
}

export interface CreateAdResult {
  success: number
  result: Ad
}

export interface CreateAdCheckoutSessionResult {
  checkout_url: string
  checkout_session_id: string
  ad_id: number
  status: string
}

export interface ReconcileAdCheckoutSessionResult {
  ad: Ad
  is_paid: boolean
}

export interface ReconcileAdCheckoutSessionPayload {
  session_id: string
}
