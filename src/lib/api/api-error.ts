import { AxiosError } from 'axios'

export type ApiFieldErrors = Record<string, string[]>

export interface ApiSuccessResponse<T> {
  success: 1
  message: string
  result: T
}

export interface ApiErrorResult {
  errors?: ApiFieldErrors
}

export interface ApiErrorResponse {
  success: 0
  message: string
  result: ApiErrorResult | unknown
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return typeof data === 'object' && data !== null && 'success' in data && data.success === 0
}

function getApiErrorResponse(error: unknown) {
  if (error instanceof AxiosError && isApiErrorResponse(error.response?.data)) {
    return error.response.data
  }

  if (isApiErrorResponse(error)) {
    return error
  }

  return null
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  const apiError = getApiErrorResponse(error)

  if (apiError?.message) {
    return apiError.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function getApiFieldErrors(error: unknown): ApiFieldErrors | undefined {
  const result = getApiErrorResponse(error)?.result

  if (typeof result !== 'object' || result === null || !('errors' in result)) {
    return undefined
  }

  const fieldErrors = result.errors

  if (!fieldErrors || typeof fieldErrors !== 'object') {
    return undefined
  }

  return fieldErrors as ApiFieldErrors
}
