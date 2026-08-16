export function createApiError(message: string, errors?: Record<string, string[]>) {
  return {
    success: 0 as const,
    message,
    result: errors ? { errors } : {},
  }
}
