export const serviceEndpoints = {
  list: '/api/services',
  detail: (serviceId: number) => `/api/services/${serviceId}`,
  byServiceProvider: (serviceProviderId: number) => `/api/service_provider/${serviceProviderId}/services`,
} as const
