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

// Most endpoints answer with the envelope { success, message, result },
// while validation failures use the framework default { message, errors }.
// Both carry a message meant for the user, so both are accepted here.
function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  if ('success' in data && data.success === 0) {
    return true
  }

  return 'message' in data || 'errors' in data
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

  // The message of a transport error names a status code or a network
  // failure. It is not written for a user, so the translated fallback
  // stays in place instead.
  return fallback
}

export function getApiFieldErrors(error: unknown): ApiFieldErrors | undefined {
  const response = getApiErrorResponse(error)

  if (!response) {
    return undefined
  }

  // Field errors sit inside the envelope's result, or at the top level
  // when the framework answers a validation failure directly.
  const container =
    typeof response.result === 'object' && response.result !== null && 'errors' in response.result
      ? response.result
      : response

  if (typeof container !== 'object' || container === null || !('errors' in container)) {
    return undefined
  }

  const fieldErrors = container.errors

  if (!fieldErrors || typeof fieldErrors !== 'object') {
    return undefined
  }

  return fieldErrors as ApiFieldErrors
}
