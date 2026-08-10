import type { ApiSuccessResponse } from '@/lib/api/api-error'
import { httpClient } from '@/lib/api/http-client'

import { authEndpoints } from '@/features/auth/api/auth-endpoints'
import type {
  DeleteAccountPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  VerifyResetOtpPayload,
  VerifyResetOtpResult,
} from '@/features/auth/types/auth.types'

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

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await httpClient.post<ApiSuccessResponse<{ message: string }>>(
    authEndpoints.forgotPassword,
    payload,
  )

  return response.data
}

export async function verifyResetOtp(payload: VerifyResetOtpPayload) {
  const response = await httpClient.post<ApiSuccessResponse<VerifyResetOtpResult>>(
    authEndpoints.verifyResetOtp,
    payload,
  )

  return response.data
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await httpClient.post<ApiSuccessResponse<null>>(authEndpoints.resetPassword, payload)

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
