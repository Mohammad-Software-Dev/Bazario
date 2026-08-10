import type { ApiSuccessResponse } from '@/lib/api/api-error'
import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

export type ListingStatus =
  | 'pending'
  | 'pending_payment'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | string

export function normalizeListingStatus(status?: string | null): ListingStatus {
  if (
    status === 'approved' ||
    status === 'rejected' ||
    status === 'pending' ||
    status === 'pending_payment' ||
    status === 'pending_review'
  ) {
    return status
  }

  return 'pending'
}

export interface ListingImage {
  id: number
  listing_id: number
  path: string
  image_url?: string | null
  sort: number
}

export interface ListingOwner {
  id: number
  name: string
  email?: string
}

export interface ListingRecord {
  id: number
  user_id: number
  title: string
  description: string | null
  price: number | string | null
  currency_iso?: string | null
  attributes: Record<string, unknown> | null
  status?: ListingStatus | null
  paid_at?: string | null
  refund_status?: string | null
  metadata?: Record<string, unknown> | null
  refund?: {
    applied: boolean
    status: string | null
    amount: number | null
    stripe_refund_id: string | null
  }
  created_at: string
  updated_at?: string
  images: ListingImage[]
  coverImage: ListingImage | null
  user: ListingOwner | null
}

export interface CreateListingPayload {
  title: string
  description?: string
  price?: number | null
  attributes?: Record<string, string> | null
  images?: FileList | null
  cover_index?: number
}

export type ListingsResult = LaravelPaginatedResponse<ListingRecord>
export type ListingsResponse = ApiSuccessResponse<ListingsResult>

export interface ListingPricingResult {
  price: number
  currency_iso: string
}

export interface CreateListingCheckoutSessionResult {
  checkout_url: string
  checkout_session_id: string
  listing_id: number
  status: string
}

export interface ReconcileListingCheckoutSessionPayload {
  session_id: string
}

export interface ReconcileListingCheckoutSessionResult {
  listing: ListingRecord
  is_paid: boolean
}
