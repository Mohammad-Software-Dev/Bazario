import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { serviceEndpoints } from '@/features/services/api/service-endpoints'
import type { ServiceFormValues } from '@/features/services/schemas/service-form-schema'
import type {
  MyServicesResult,
  ServiceListItem,
  ServiceProviderServicesResult,
  ServicesResult,
} from '@/features/services/types/service.types'

interface GetServicesParams {
  categoryId?: number
  page?: number
  perPage?: number
}

function appendLocalizedField(formData: FormData, key: string, value: { en: string; ar: string }) {
  formData.append(`${key}[en]`, value.en)
  formData.append(`${key}[ar]`, value.ar)
}

function buildServiceFormData(payload: ServiceFormValues, methodOverride?: 'PUT') {
  const formData = new FormData()

  appendLocalizedField(formData, 'title', payload.title)
  appendLocalizedField(formData, 'description', payload.description)
  formData.append('category_id', String(payload.category_id))
  formData.append('price', String(payload.price))

  if (payload.duration_minutes !== null) {
    formData.append('duration_minutes', String(payload.duration_minutes))
  }

  if (payload.location_type.trim()) {
    formData.append('location_type', payload.location_type.trim())
  }

  formData.append('is_active', payload.is_active ? '1' : '0')

  if (payload.max_concurrent_bookings !== null) {
    formData.append('max_concurrent_bookings', String(payload.max_concurrent_bookings))
  }

  if (payload.slot_interval_minutes !== null) {
    formData.append('slot_interval_minutes', String(payload.slot_interval_minutes))
  }

  if (payload.cancel_cutoff_hours !== null) {
    formData.append('cancel_cutoff_hours', String(payload.cancel_cutoff_hours))
  }

  if (payload.edit_cutoff_hours !== null) {
    formData.append('edit_cutoff_hours', String(payload.edit_cutoff_hours))
  }

  if (payload.cancel_late_policy) {
    formData.append('cancel_late_policy', payload.cancel_late_policy)
  }

  if (payload.edit_late_policy) {
    formData.append('edit_late_policy', payload.edit_late_policy)
  }

  if (payload.images instanceof FileList) {
    Array.from(payload.images).forEach((file) => {
      formData.append('images[]', file)
    })
  }

  if (methodOverride) {
    formData.append('_method', methodOverride)
  }

  return formData
}

export async function getServices(params: GetServicesParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<ServicesResult>>(serviceEndpoints.list, {
    params: {
      category_id: params.categoryId,
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getMyServices(params: GetServicesParams = {}) {
  const response = await httpClient.get<ApiSuccessResponse<MyServicesResult>>(serviceEndpoints.myList, {
    params: {
      page: params.page,
      per_page: params.perPage,
    },
  })

  return response.data
}

export async function getServicesByServiceProvider(
  serviceProviderId: number,
  params: Omit<GetServicesParams, 'categoryId'> = {},
) {
  const response = await httpClient.get<ApiSuccessResponse<ServiceProviderServicesResult>>(
    serviceEndpoints.byServiceProvider(serviceProviderId),
    {
      params: {
        page: params.page,
        per_page: params.perPage,
      },
    },
  )

  return response.data
}

export async function getService(serviceId: number) {
  const response = await httpClient.get<ApiSuccessResponse<ServiceListItem>>(serviceEndpoints.detail(serviceId))

  return response.data
}

export async function createService(payload: ServiceFormValues) {
  const response = await httpClient.post<ApiSuccessResponse<ServiceListItem>>(
    serviceEndpoints.create,
    buildServiceFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function updateService(serviceId: number, payload: ServiceFormValues) {
  const response = await httpClient.post<ApiSuccessResponse<ServiceListItem>>(
    serviceEndpoints.update(serviceId),
    buildServiceFormData(payload, 'PUT'),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )

  return response.data
}

export async function deleteService(serviceId: number) {
  const response = await httpClient.delete<ApiSuccessResponse<[]>>(serviceEndpoints.delete(serviceId))

  return response.data
}
