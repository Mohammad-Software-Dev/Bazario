import { describe, expect, it } from 'vitest'

import { timeOffFormSchema } from '@/features/provider-availability/schemas/time-off-form-schema'

describe('time off form schema', () => {
  it('accepts a valid time-off payload', () => {
    expect(
      timeOffFormSchema.safeParse({
        starts_at: '2026-08-20T10:00',
        ends_at: '2026-08-20T11:00',
        is_holiday: false,
        reason: 'Unavailable',
      }).success,
    ).toBe(true)
  })

  it('rejects missing start or end values', () => {
    expect(
      timeOffFormSchema.safeParse({
        starts_at: '',
        ends_at: '',
        is_holiday: false,
        reason: '',
      }).success,
    ).toBe(false)
  })
})
