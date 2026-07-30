import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { authEndpoints } from '@/features/auth/api/auth-endpoints'
import type { DeleteAccountPayload, LoginPayload, LoginResult, RegisterPayload, RegisterResult, UpdatePasswordPayload } from '@/features/auth/types/auth.types'

export async function login(payload: LoginPayload) {
  const response = await httpClient.post<ApiSuccessResponse<LoginResult>>(authEndpoints.login, payload)

  return response.data
}

export async function register(payload: RegisterPayload) {
  const response = await httpClient.post<ApiSuccessResponse<RegisterResult>>(authEndpoints.register, payload)

  return response.data
}

export async function logout() {
  const response = await httpClient.post<ApiSuccessResponse<null>>(authEndpoints.logout)

  return response.data
}

export async function updatePassword(payload: UpdatePasswordPayload) {
  const response = await httpClient.post<ApiSuccessResponse<null>>(authEndpoints.updatePassword, payload)

  return response.data
}

export async function deleteAccount(payload: DeleteAccountPayload) {
  const response = await httpClient.delete<ApiSuccessResponse<null>>(authEndpoints.deleteAccount, { data: payload })

  return response.data
}
