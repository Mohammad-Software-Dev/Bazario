export const serviceEndpoints = {
  list: '/api/services',
  myList: '/api/my-services',
  create: '/api/service',
  detail: (serviceId: number) => `/api/services/${serviceId}`,
  update: (serviceId: number) => `/api/service/${serviceId}`,
  delete: (serviceId: number) => `/api/service/${serviceId}`,
  byServiceProvider: (serviceProviderId: number) => `/api/service_provider/${serviceProviderId}/services`,
} as const
