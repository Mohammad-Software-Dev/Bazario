import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { adEndpoints } from '@/features/ads/api/ad-endpoints'
import type {
  AdPosition,
  AdsResult,
  CreateAdPayload,
  CreateAdResult,
  CreateAdCheckoutSessionResult,
  ReconcileAdCheckoutSessionPayload,
  ReconcileAdCheckoutSessionResult,
} from '@/features/ads/types/ad.types'

function appendFiles(formData: FormData, files: FileList | null | undefined, key: string) {
  if (!files) {
    return
  }

  Array.from(files).forEach((file) => {
    formData.append(key, file)
  })
}

function buildCreateAdFormData(payload: CreateAdPayload) {
  const formData = new FormData()

  formData.append('title', payload.title)
  formData.append('adable_type', payload.adable_type)
  formData.append('ad_position_id', String(payload.ad_position_id))

  if (payload.subtitle) {
    formData.append('subtitle', payload.subtitle)
  }

  formData.append('duration_days', String(payload.duration_days))

  if (typeof payload.adable_id === 'number') {
    formData.append('adable_id', String(payload.adable_id))
  }

  appendFiles(formData, payload.images, 'images[]')

  return formData
}

export async function getAdPositions() {
  const response = await httpClient.get<ApiSuccessResponse<AdPosition[]>>(adEndpoints.positions)
  return response.data
}

export async function getMyAds(page = 1) {
  const response = await httpClient.get<ApiSuccessResponse<AdsResult>>(adEndpoints.myAds, {
    params: { page },
  })

  return response.data
}

export async function createAd(payload: CreateAdPayload) {
  const response = await httpClient.post<CreateAdResult>(
    adEndpoints.create,
    buildCreateAdFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function createAdCheckoutSession(adId: number) {
  const response = await httpClient.post<CreateAdCheckoutSessionResult>(adEndpoints.checkoutSession(adId))

  return response.data
}

export async function deleteAd(adId: number) {
  const response = await httpClient.delete<ApiSuccessResponse<null>>(adEndpoints.delete(adId))

  return response.data
}

export async function reconcileAdCheckoutSession(
  adId: number,
  payload: ReconcileAdCheckoutSessionPayload,
) {
  const response = await httpClient.post<ReconcileAdCheckoutSessionResult>(
    adEndpoints.reconcileCheckoutSession(adId),
    payload,
  )

  return response.data
}
