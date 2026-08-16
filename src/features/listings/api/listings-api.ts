import { httpClient } from '@/lib/api/http-client'

import { listingEndpoints } from '@/features/listings/api/listing-endpoints'
import { normalizeListingRecord, normalizeListingsPagination } from '@/features/listings/lib/listing-mappers'
import type {
  CreateListingCheckoutSessionResult,
  CreateListingPayload,
  ListingPricingResult,
  ListingRecord,
  ListingsResponse,
  ReconcileListingCheckoutSessionPayload,
  ReconcileListingCheckoutSessionResult,
} from '@/features/listings/types/listing.types'

function buildCreateListingFormData(payload: CreateListingPayload) {
  const formData = new FormData()

  formData.append('title', payload.title)

  if (payload.description) {
    formData.append('description', payload.description)
  }

  if (typeof payload.price === 'number') {
    formData.append('price', String(payload.price))
  }

  if (payload.attributes && Object.keys(payload.attributes).length) {
    formData.append('attributes', JSON.stringify(payload.attributes))
  }

  if (typeof payload.cover_index === 'number') {
    formData.append('cover_index', String(payload.cover_index))
  }

  if (payload.images) {
    Array.from(payload.images).forEach((file) => {
      formData.append('images[]', file)
    })
  }

  return formData
}

export async function getMyListings(page = 1) {
  const response = await httpClient.get<ListingsResponse>(listingEndpoints.myListings, {
    params: { page },
  })

  return {
    ...response.data,
    result: normalizeListingsPagination(response.data.result),
  }
}

export async function createListing(payload: CreateListingPayload) {
  const response = await httpClient.post<{ success: number; result: ListingRecord; message?: string }>(
    listingEndpoints.create,
    buildCreateListingFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return {
    ...response.data,
    result: normalizeListingRecord(response.data.result),
  }
}

export async function getListingPricing() {
  const response = await httpClient.get<{ success: number; result: ListingPricingResult }>(listingEndpoints.pricing)

  return response.data
}

export async function createListingCheckoutSession(listingId: number) {
  const response = await httpClient.post<CreateListingCheckoutSessionResult>(
    listingEndpoints.checkoutSession(listingId),
  )

  return response.data
}

export async function deleteListing(listingId: number) {
  const response = await httpClient.delete<{ success: number; message?: string }>(
    listingEndpoints.delete(listingId),
  )

  return response.data
}

export async function reconcileListingCheckoutSession(
  listingId: number,
  payload: ReconcileListingCheckoutSessionPayload,
) {
  const response = await httpClient.post<ReconcileListingCheckoutSessionResult>(
    listingEndpoints.reconcileCheckoutSession(listingId),
    payload,
  )

  return {
    ...response.data,
    listing: normalizeListingRecord(response.data.listing),
  }
}
