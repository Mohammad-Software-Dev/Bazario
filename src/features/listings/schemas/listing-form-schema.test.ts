import { describe, expect, it } from 'vitest'

import { listingFormSchema } from '@/features/listings/schemas/listing-form-schema'

describe('listing form schema', () => {
  it('accepts a valid listing payload', () => {
    expect(
      listingFormSchema.safeParse({
        title: 'Marketplace update',
        description: 'Something new',
        price: '12.5',
        attributes: '',
      }).success,
    ).toBe(true)
  })

  it('rejects non-numeric price values', () => {
    const result = listingFormSchema.safeParse({
      title: 'Marketplace update',
      description: 'Something new',
      price: 'abc',
      attributes: '',
    })

    expect(result.success).toBe(false)
  })
})
