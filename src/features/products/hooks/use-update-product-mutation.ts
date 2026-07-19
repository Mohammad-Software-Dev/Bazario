import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProduct } from '@/features/products/api/products-api'
import type { ProductFormValues } from '@/features/products/schemas/product-form-schema'

interface UpdateProductMutationVariables {
  payload: ProductFormValues
  productId: number
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, payload }: UpdateProductMutationVariables) => updateProduct(productId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['seller-products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] })
    },
  })
}
