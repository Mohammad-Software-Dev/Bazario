export const providerAvailabilityEndpoints = {
  deleteTimeOff: (timeOffId: number) => `/api/service_provider/time-off/${timeOffId}`,
  list: '/api/service_provider/availability',
  timeOff: '/api/service_provider/time-off',
  workingHours: '/api/service_provider/working-hours',
} as const
