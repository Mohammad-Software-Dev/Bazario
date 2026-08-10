import { resolveMediaUrl } from '@/lib/api/asset-url'
import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

import type { ListingImage, ListingRecord } from '@/features/listings/types/listing.types'

type RawListingImage = ListingImage & {
  image_url?: string | null
  url?: string | null
}

type RawListingRecord = Omit<ListingRecord, 'images' | 'coverImage'> & {
  images?: RawListingImage[] | null
  coverImage?: RawListingImage | null
  cover_image?: RawListingImage | null
}

export function normalizeListingImage(image?: RawListingImage | null): ListingImage | null {
  if (!image) {
    return null
  }

  return {
    ...image,
    image_url: resolveMediaUrl(image.image_url ?? image.url ?? null, image.path),
  }
}

export function normalizeListingRecord(listing: RawListingRecord): ListingRecord {
  return {
    ...listing,
    images: (listing.images ?? []).map((image) => normalizeListingImage(image)).filter(Boolean) as ListingImage[],
    coverImage: normalizeListingImage(listing.coverImage ?? listing.cover_image ?? null),
  }
}

export function normalizeListingsPagination(
  result: LaravelPaginatedResponse<RawListingRecord>,
): LaravelPaginatedResponse<ListingRecord> {
  return {
    ...result,
    data: result.data.map(normalizeListingRecord),
  }
}

export function getListingImageUrl(listing: ListingRecord) {
  return resolveMediaUrl(
    listing.coverImage?.image_url ?? listing.images[0]?.image_url ?? null,
    listing.coverImage?.path ?? listing.images[0]?.path ?? null,
  )
}
