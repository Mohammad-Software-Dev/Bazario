import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategoriesQuery } from '@/features/categories/hooks/use-categories-query'
import { ProductForm } from '@/features/products/components/product-form'
import { useCreateProductMutation } from '@/features/products/hooks/use-create-product-mutation'
import { useProductQuery } from '@/features/products/hooks/use-product-query'
import { useUpdateProductMutation } from '@/features/products/hooks/use-update-product-mutation'
import type { ProductFormValues } from '@/features/products/schemas/product-form-schema'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseProductId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function ProductEditorPage() {
  const navigate = useNavigate()
  const { productId: productIdParam } = useParams()
  const productId = parseProductId(productIdParam)
  const isEditMode = productId !== null
  const categoriesQuery = useCategoriesQuery('product')
  const productQuery = useProductQuery(productId ?? 0, isEditMode)
  const createProductMutation = useCreateProductMutation()
  const updateProductMutation = useUpdateProductMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  async function handleSubmit(values: ProductFormValues) {
    setServerError(null)

    try {
      if (isEditMode && productId) {
        await updateProductMutation.mutateAsync({ productId, payload: values })
      } else {
        await createProductMutation.mutateAsync(values)
      }

      navigate('/account/seller/products')
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to save this product right now.'))
    }
  }

  if (isEditMode && !productId) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">Invalid product id.</CardContent>
        </Card>
      </div>
    )
  }

  if (isEditMode && productQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Loading product...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-32 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditMode && productQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(productQuery.error, 'Unable to load this product right now.')}
          </CardContent>
        </Card>
      </div>
    )
  }

  const product = productQuery.data?.result
  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Seller workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {isEditMode ? 'Edit product' : 'Create product'}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/seller/products">Back to products</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update product details' : 'New product details'}</CardTitle>
          <CardDescription>
            Configure the product content that will be shown in the public marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

          <ProductForm
            categories={categoriesQuery.data?.result ?? []}
            initialProduct={product}
            isCategoriesLoading={categoriesQuery.isLoading}
            isSubmitting={isSubmitting}
            mode={isEditMode ? 'edit' : 'create'}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
