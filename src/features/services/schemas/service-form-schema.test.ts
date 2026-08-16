import { describe, expect, it } from 'vitest'

import { serviceFormSchema } from '@/features/services/schemas/service-form-schema'

describe('service form schema', () => {
  it('accepts a valid payload', () => {
    const result = serviceFormSchema.safeParse({
      title: { en: 'Consultation', ar: 'استشارة' },
      description: { en: '', ar: '' },
      category_id: 2,
      price: 35,
      duration_minutes: 60,
      location_type: 'remote',
      is_active: true,
      max_concurrent_bookings: 1,
      slot_interval_minutes: 30,
      cancel_cutoff_hours: 12,
      edit_cutoff_hours: 6,
      cancel_late_policy: 'deny',
      edit_late_policy: 'allow',
    })

    expect(result.success).toBe(true)
  })

  it('rejects missing english title', () => {
    const result = serviceFormSchema.safeParse({
      title: { en: '', ar: 'استشارة' },
      description: { en: '', ar: '' },
      category_id: 2,
      price: 35,
      duration_minutes: 60,
      location_type: 'remote',
      is_active: true,
      max_concurrent_bookings: 1,
      slot_interval_minutes: 30,
      cancel_cutoff_hours: 12,
      edit_cutoff_hours: 6,
      cancel_late_policy: 'deny',
      edit_late_policy: 'allow',
    })

    expect(result.success).toBe(false)
  })
})
