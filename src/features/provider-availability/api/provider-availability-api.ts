import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { providerAvailabilityEndpoints } from '@/features/provider-availability/api/provider-availability-endpoints'
import type {
  AddTimeOffPayload,
  ProviderAvailabilityResult,
  ProviderTimeOff,
  UpdateWorkingHoursPayload,
} from '@/features/provider-availability/types/provider-availability.types'

export async function getProviderAvailability() {
  const response = await httpClient.get<ProviderAvailabilityResult>(providerAvailabilityEndpoints.list)

  return response.data
}

export async function updateWorkingHours(payload: UpdateWorkingHoursPayload) {
  const response = await httpClient.put<ApiSuccessResponse<{ message: string }>>(
    providerAvailabilityEndpoints.workingHours,
    payload,
  )

  return response.data
}

export async function addTimeOff(payload: AddTimeOffPayload) {
  const response = await httpClient.post<ProviderTimeOff>(providerAvailabilityEndpoints.timeOff, payload)

  return response.data
}

export async function deleteTimeOff(timeOffId: number) {
  const response = await httpClient.delete<ApiSuccessResponse<{ message: string }>>(
    providerAvailabilityEndpoints.deleteTimeOff(timeOffId),
  )

  return response.data
}
