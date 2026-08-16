import { describe, expect, it } from 'vitest'

import {
  getListingImageUrl,
  normalizeListingImage,
  normalizeListingRecord,
} from '@/features/listings/lib/listing-mappers'

describe('listing mappers', () => {
  it('normalizes listing image urls', () => {
    const image = normalizeListingImage({
      id: 1,
      listing_id: 2,
      path: 'listing.jpg',
      url: '/listing.jpg',
      sort: 0,
    })

    expect(image?.image_url).toContain('/listing.jpg')
  })

  it('normalizes listing cover image aliases', () => {
    const record = normalizeListingRecord({
      id: 1,
      user_id: 2,
      title: 'Announcement',
      description: null,
      price: null,
      attributes: null,
      created_at: '2026-08-10T10:00:00Z',
      images: [],
      cover_image: {
        id: 3,
        listing_id: 1,
        path: 'cover.jpg',
        url: '/cover.jpg',
        sort: 0,
      },
      user: null,
    } as never)

    expect(record.coverImage?.image_url).toContain('/cover.jpg')
  })

  it('prefers cover image url when available', () => {
    const url = getListingImageUrl({
      coverImage: { image_url: '/cover.jpg', path: 'cover.jpg' },
      images: [{ image_url: '/fallback.jpg', path: 'fallback.jpg' }],
    } as never)

    expect(url).toContain('/cover.jpg')
  })
})
