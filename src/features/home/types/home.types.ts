import type { ProductListItem } from '@/features/products/types/product.types'
import type { ServiceListItem } from '@/features/services/types/service.types'

export interface HomeResult {
  products: {
    latest: ProductListItem[]
  }
  services: {
    latest: ServiceListItem[]
  }
  ads: {
    latest: unknown[]
  }
}
