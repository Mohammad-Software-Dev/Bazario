export interface ProviderWorkingHour {
  id: number
  service_provider_id: number
  day_of_week: number
  start_time: string
  end_time: string
}

export interface ProviderTimeOff {
  id: number
  service_provider_id: number
  starts_at: string
  ends_at: string
  is_holiday: boolean
  reason: string | null
}

export interface ProviderAvailabilityResult {
  id: number
  user_id: number
  name: string
  address: string
  logo: string | null
  description: string | null
  timezone?: string | null
  working_hours: ProviderWorkingHour[]
  time_offs: ProviderTimeOff[]
}

export interface WorkingHourIntervalInput {
  end_time: string
  start_time: string
}

export interface WorkingHourDayInput {
  day_of_week: number
  intervals: WorkingHourIntervalInput[]
}

export interface UpdateWorkingHoursPayload {
  timezone: string
  days: WorkingHourDayInput[]
}

export interface AddTimeOffPayload {
  starts_at: string
  ends_at: string
  timezone: string
  is_holiday: boolean
  reason?: string
}
