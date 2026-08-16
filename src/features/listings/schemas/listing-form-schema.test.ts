import { describe, expect, it } from 'vitest'

import { listingFormSchema } from '@/features/listings/schemas/listing-form-schema'

function createFileListLike() {
  return {
    0: new File(['image'], 'announcement.jpg', { type: 'image/jpeg' }),
    length: 1,
    item: (index: number) => (index === 0 ? new File(['image'], 'announcement.jpg', { type: 'image/jpeg' }) : null),
  }
}

describe('listing form schema', () => {
  it('accepts a valid listing payload', () => {
    expect(
      listingFormSchema.safeParse({
        title: 'Marketplace update',
        description: 'Something new',
        images: createFileListLike(),
      }).success,
    ).toBe(true)
  })

  it('rejects missing images', () => {
    const result = listingFormSchema.safeParse({
      title: 'Marketplace update',
      description: 'Something new',
      images: undefined,
    })

    expect(result.success).toBe(false)
  })
})
