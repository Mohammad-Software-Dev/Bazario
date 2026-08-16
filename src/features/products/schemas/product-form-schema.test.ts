import { describe, expect, it } from 'vitest'

import { productFormSchema } from '@/features/products/schemas/product-form-schema'

describe('product form schema', () => {
  it('accepts a valid product payload', () => {
    const result = productFormSchema.safeParse({
      name: { en: 'Desk Lamp', ar: 'مصباح' },
      description: { en: '', ar: '' },
      category_id: 2,
      price: 18,
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid category id', () => {
    const result = productFormSchema.safeParse({
      name: { en: 'Desk Lamp', ar: 'مصباح' },
      description: { en: '', ar: '' },
      category_id: 0,
      price: 18,
    })

    expect(result.success).toBe(false)
  })
})
