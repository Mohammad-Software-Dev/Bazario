import type {
  ProviderAvailabilityResult,
  ProviderTimeOff,
  WorkingHourDayInput,
} from '@/features/provider-availability/types/provider-availability.types'

const fallbackTimezones = [
  'UTC',
  'Europe/Berlin',
  'Europe/London',
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Amman',
  'Asia/Baghdad',
  'Asia/Kuwait',
  'Asia/Qatar',
  'Asia/Bahrain',
  'Asia/Muscat',
  'Asia/Karachi',
  'Asia/Istanbul',
  'Africa/Cairo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
] as const

const supportedTimezones =
  typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : [...fallbackTimezones]

export function normalizeTimeValue(value: string) {
  return value.slice(0, 5)
}

export function buildWorkingHourDays(
  provider: ProviderAvailabilityResult | undefined,
): WorkingHourDayInput[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    day_of_week: dayOfWeek,
    intervals: (provider?.working_hours ?? [])
      .filter((item) => item.day_of_week === dayOfWeek)
      .map((item) => ({
        end_time: normalizeTimeValue(item.end_time),
        start_time: normalizeTimeValue(item.start_time),
      })),
  }))
}

export function cloneWorkingHourDays(days: WorkingHourDayInput[]) {
  return days.map((day) => ({
    day_of_week: day.day_of_week,
    intervals: day.intervals.map((interval) => ({ ...interval })),
  }))
}

export function buildTimezoneOptions(selectedTimezone: string) {
  const options = new Set(supportedTimezones)

  if (selectedTimezone) {
    options.add(selectedTimezone)
  }

  return Array.from(options).sort((first, second) => first.localeCompare(second))
}

export function formatTimeOffDate(value: string, timezone: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date)
}

export function sortTimeOffs(timeOffs: ProviderTimeOff[]) {
  return [...timeOffs].sort((first, second) => first.starts_at.localeCompare(second.starts_at))
}

export function normalizeWorkingHoursPayload(days: WorkingHourDayInput[]) {
  return days
    .map((day) => ({
      day_of_week: day.day_of_week,
      intervals: day.intervals.map((interval) => ({
        start_time: normalizeTimeValue(interval.start_time),
        end_time: normalizeTimeValue(interval.end_time),
      })),
    }))
    .filter((day) => day.intervals.length > 0)
}
