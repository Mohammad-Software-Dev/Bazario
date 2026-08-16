import { describe, expect, it } from 'vitest'

import {
  buildTimezoneOptions,
  buildWorkingHourDays,
  cloneWorkingHourDays,
  normalizeTimeValue,
  normalizeWorkingHoursPayload,
  sortTimeOffs,
} from '@/features/provider-availability/lib/provider-availability'

describe('provider availability helpers', () => {
  it('normalizes HH:mm:ss to HH:mm', () => {
    expect(normalizeTimeValue('09:30:00')).toBe('09:30')
  })

  it('builds seven working-hour day entries', () => {
    const days = buildWorkingHourDays({
      working_hours: [{ day_of_week: 1, start_time: '09:00:00', end_time: '17:00:00' }],
    } as never)

    expect(days).toHaveLength(7)
    expect(days[1].intervals[0]).toEqual({ start_time: '09:00', end_time: '17:00' })
  })

  it('clones working-hour days deeply', () => {
    const original = [{ day_of_week: 1, intervals: [{ start_time: '09:00', end_time: '17:00' }] }]
    const clone = cloneWorkingHourDays(original)
    clone[0].intervals[0].start_time = '10:00'

    expect(original[0].intervals[0].start_time).toBe('09:00')
  })

  it('keeps selected timezone in timezone options', () => {
    expect(buildTimezoneOptions('Mars/Base')).toContain('Mars/Base')
  })

  it('sorts time offs by start time', () => {
    const sorted = sortTimeOffs([
      { id: 2, starts_at: '2026-08-22T10:00:00Z' },
      { id: 1, starts_at: '2026-08-20T10:00:00Z' },
    ] as never)

    expect(sorted.map((item) => item.id)).toEqual([1, 2])
  })

  it('normalizes payload and removes empty days', () => {
    expect(
      normalizeWorkingHoursPayload([
        { day_of_week: 1, intervals: [{ start_time: '09:00:00', end_time: '17:00:00' }] },
        { day_of_week: 2, intervals: [] },
      ]),
    ).toEqual([
      {
        day_of_week: 1,
        intervals: [{ start_time: '09:00', end_time: '17:00' }],
      },
    ])
  })
})
