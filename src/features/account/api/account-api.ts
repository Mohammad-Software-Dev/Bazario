import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { accountEndpoints } from '@/features/account/api/account-endpoints'
import type {
  MeResult,
  UpgradeToSellerPayload,
  UpgradeToSellerResult,
  UpgradeToServiceProviderPayload,
  UpgradeToServiceProviderResult,
} from '@/features/account/types/account.types'

function appendFiles(formData: FormData, files: FileList | null | undefined, key: string) {
  if (!files) {
    return
  }

  Array.from(files).forEach((file) => {
    formData.append(key, file)
  })
}

function buildSellerFormData(payload: UpgradeToSellerPayload) {
  const formData = new FormData()

  formData.append('store_owner_name', payload.store_owner_name)
  formData.append('store_name', payload.store_name)
  formData.append('address', payload.address)

  if (payload.email) {
    formData.append('email', payload.email)
  }

  if (payload.phone) {
    formData.append('phone', payload.phone)
  }

  if (payload.description) {
    formData.append('description', payload.description)
  }

  if (payload.logo?.item(0)) {
    formData.append('logo', payload.logo.item(0) as File)
  }

  appendFiles(formData, payload.attachments, 'attachments[]')

  return formData
}

function buildServiceProviderFormData(payload: UpgradeToServiceProviderPayload) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('address', payload.address)

  if (payload.email) {
    formData.append('email', payload.email)
  }

  if (payload.phone) {
    formData.append('phone', payload.phone)
  }

  if (payload.description) {
    formData.append('description', payload.description)
  }

  if (payload.logo?.item(0)) {
    formData.append('logo', payload.logo.item(0) as File)
  }

  appendFiles(formData, payload.attachments, 'attachments[]')

  return formData
}

export async function getMe(includeSummary = false, limit?: number) {
  const params = new URLSearchParams()

  if (includeSummary) {
    params.set('include', 'summary')
  }

  if (typeof limit === 'number') {
    params.set('limit', String(limit))
  }

  const queryString = params.toString()
  const path = queryString ? `${accountEndpoints.me}?${queryString}` : accountEndpoints.me

  const response = await httpClient.get<ApiSuccessResponse<MeResult>>(path)

  return response.data
}

export async function upgradeToSeller(payload: UpgradeToSellerPayload) {
  const response = await httpClient.post<ApiSuccessResponse<UpgradeToSellerResult>>(
    accountEndpoints.upgradeToSeller,
    buildSellerFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function upgradeToServiceProvider(payload: UpgradeToServiceProviderPayload) {
  const response = await httpClient.post<ApiSuccessResponse<UpgradeToServiceProviderResult>>(
    accountEndpoints.upgradeToServiceProvider,
    buildServiceProviderFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}
