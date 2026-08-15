import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PaginationControls } from '@/components/shared/pagination-controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SellerProductCard } from '@/features/products/components/seller-product-card'
import { useDeleteProductMutation } from '@/features/products/hooks/use-delete-product-mutation'
import { useMyProductsQuery } from '@/features/products/hooks/use-my-products-query'
import type { ProductListItem } from '@/features/products/types/product.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parsePage(value: string | null) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

export function SellerProductsManagementPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null)
  const page = useMemo(() => parsePage(searchParams.get('page')), [searchParams])
  const myProductsQuery = useMyProductsQuery({ page, perPage: 8 })
  const deleteProductMutation = useDeleteProductMutation()

  const result = myProductsQuery.data?.result
  const products = result?.data ?? []
  const isDeleting = deleteProductMutation.isPending && deleteProductMutation.variables === productToDelete?.id

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams()

    if (nextPage > 1) {
      nextParams.set('page', String(nextPage))
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(product: ProductListItem) {
    setProductToDelete(product)
  }

  function confirmDelete() {
    if (!productToDelete) {
      return
    }

    deleteProductMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setProductToDelete(null)
      },
    })
  }

  const productDeleteName = productToDelete
    ? typeof productToDelete.name === 'string'
      ? productToDelete.name
      : t('seller.thisProduct')
    : t('seller.thisProduct')

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t('seller.workspace')}</p>
            <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              {t('seller.myProducts')}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/account/seller/products/new">{t('seller.addProduct')}</Link>
            </Button>
          </div>
        </section>

        {myProductsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden pt-0">
                <div className="aspect-4/3 animate-pulse bg-muted" />
                <CardHeader className="space-y-2">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-10 w-full animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {!myProductsQuery.isLoading && myProductsQuery.isError ? (
          <Card>
            <CardContent className="py-6 text-sm text-destructive">
              {getApiErrorMessage(myProductsQuery.error, t('seller.loadMyProductsError'))}
            </CardContent>
          </Card>
        ) : null}

        {!myProductsQuery.isLoading && !myProductsQuery.isError ? (
          <section className="space-y-6">
            {products.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <SellerProductCard key={product.id} product={product} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-sm text-muted-foreground">
                  {t('seller.noProductsYet')}
                </CardContent>
              </Card>
            )}

            <PaginationControls
              currentPage={result?.current_page ?? 1}
              lastPage={result?.last_page ?? 1}
              onPageChange={handlePageChange}
            />
          </section>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null)
          }
        }}
        title={t('seller.deleteProductTitle')}
        description={t('seller.deleteProductDescription', { name: productDeleteName })}
        confirmLabel={isDeleting ? t('common.deleting') : t('seller.deleteProductTitle')}
        cancelLabel={t('seller.keepProduct')}
        onConfirm={confirmDelete}
        isPending={isDeleting}
        variant="destructive"
      />
    </>
  )
}
