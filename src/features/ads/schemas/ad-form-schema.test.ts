import { describe, expect, it } from 'vitest'

import { adFormSchema } from '@/features/ads/schemas/ad-form-schema'

describe('ad form schema', () => {
  it('accepts a valid seller promotion without adable id', () => {
    expect(
      adFormSchema.safeParse({
        title: 'Grow your profile',
        subtitle: '',
        tier: 'gold',
        adable_type: 'seller',
        adable_id: null,
        duration_days: 3,
      }).success,
    ).toBe(true)
  })

  it('requires adable id for product promotions', () => {
    const result = adFormSchema.safeParse({
      title: 'Promote product',
      subtitle: '',
      tier: 'gold',
      adable_type: 'product',
      adable_id: null,
      duration_days: 3,
    })

    expect(result.success).toBe(false)
  })
})
