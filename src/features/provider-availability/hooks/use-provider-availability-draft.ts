import { useMemo, useState } from 'react'

import {
  buildWorkingHourDays,
  buildTimezoneOptions,
  cloneWorkingHourDays,
} from '@/features/provider-availability/lib/provider-availability'
import type {
  ProviderAvailabilityResult,
  WorkingHourDayInput,
} from '@/features/provider-availability/types/provider-availability.types'

interface AvailabilityDraft {
  providerId: number | null
  timezone: string
  days: WorkingHourDayInput[]
}

export function useProviderAvailabilityDraft(provider: ProviderAvailabilityResult | undefined) {
  const initialTimezone = provider?.timezone ?? 'Asia/Dubai'
  const initialDays = useMemo(() => buildWorkingHourDays(provider), [provider])
  const [draft, setDraft] = useState<AvailabilityDraft | null>(null)

  const isDraftForCurrentProvider = draft?.providerId === (provider?.id ?? null)
  const timezone = isDraftForCurrentProvider ? draft.timezone : initialTimezone
  const days = isDraftForCurrentProvider ? draft.days : initialDays
  const timezoneOptions = useMemo(() => buildTimezoneOptions(timezone), [timezone])

  function updateDraft(updater: (current: AvailabilityDraft) => AvailabilityDraft) {
    setDraft((currentDraft) => {
      const baseDraft: AvailabilityDraft =
        currentDraft?.providerId === (provider?.id ?? null)
          ? currentDraft
          : {
              providerId: provider?.id ?? null,
              timezone: initialTimezone,
              days: cloneWorkingHourDays(initialDays),
            }

      return updater(baseDraft)
    })
  }

  function setTimezone(timezoneValue: string) {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      timezone: timezoneValue,
    }))
  }

  function updateDay(dayOfWeek: number, updater: (day: WorkingHourDayInput) => WorkingHourDayInput) {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      days: currentDraft.days.map((day) => (day.day_of_week === dayOfWeek ? updater(day) : day)),
    }))
  }

  function addInterval(dayOfWeek: number) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: [...day.intervals, { start_time: '09:00', end_time: '17:00' }],
    }))
  }

  function removeInterval(dayOfWeek: number, intervalIndex: number) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: day.intervals.filter((_, index) => index !== intervalIndex),
    }))
  }

  function changeInterval(
    dayOfWeek: number,
    intervalIndex: number,
    field: 'start_time' | 'end_time',
    value: string,
  ) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: day.intervals.map((interval, index) =>
        index === intervalIndex ? { ...interval, [field]: value } : interval,
      ),
    }))
  }

  function clearDraft() {
    setDraft(null)
  }

  return {
    days,
    timezone,
    timezoneOptions,
    addInterval,
    changeInterval,
    clearDraft,
    removeInterval,
    setTimezone,
  }
}
