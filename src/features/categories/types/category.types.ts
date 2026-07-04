import type { LocalizedValue } from '@/lib/localized-value'

export type CategoryType = 'product' | 'service'

export interface CategoryItem {
  id: number
  name: LocalizedValue
  image: string | null
  parent_id: number | null
  slug: string | null
  type: string | null
  description: string | null
}
