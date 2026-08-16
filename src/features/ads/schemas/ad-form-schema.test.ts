import { describe, expect, it } from 'vitest'

import { adFormSchema } from '@/features/ads/schemas/ad-form-schema'

function createFileListLike() {
  return {
    0: new File(['image'], 'ad.jpg', { type: 'image/jpeg' }),
    length: 1,
    item: (index: number) => (index === 0 ? new File(['image'], 'ad.jpg', { type: 'image/jpeg' }) : null),
  }
}

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
        images: createFileListLike(),
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
      images: createFileListLike(),
    })

    expect(result.success).toBe(false)
  })

  it('requires at least one image', () => {
    const result = adFormSchema.safeParse({
      title: 'Grow your profile',
      subtitle: '',
      tier: 'gold',
      adable_type: 'seller',
      adable_id: null,
      duration_days: 3,
      images: undefined,
    })

    expect(result.success).toBe(false)
  })
})
