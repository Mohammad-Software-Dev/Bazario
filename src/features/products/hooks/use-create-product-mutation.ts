import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createProduct } from '@/features/products/api/products-api'
import type { ProductFormValues } from '@/features/products/schemas/product-form-schema'

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProductFormValues) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller-products'] })
    },
  })
}
