import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { authEndpoints } from '@/features/auth/api/auth-endpoints'
import type { LoginPayload, LoginResult, RegisterPayload, RegisterResult } from '@/features/auth/types/auth.types'

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
