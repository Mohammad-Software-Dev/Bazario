import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { PaginationControls } from '@/components/shared/pagination-controls'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CategoryFilter } from '@/features/categories/components/category-filter'
import { useCategoriesQuery } from '@/features/categories/hooks/use-categories-query'
import { ProductPreviewCard } from '@/features/products/components/product-preview-card'
import { useProductsQuery } from '@/features/products/hooks/use-products-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

function ProductsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden rounded-3xl border-border/70 shadow-sm">
          <div className="aspect-4/3 animate-pulse bg-muted" />
          <CardHeader className="space-y-3 p-4 pb-0">
            <div className="h-6 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function parsePage(value: string | null) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

function parseCategoryId(value: string | null) {
  const categoryId = Number(value)

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return undefined
  }

  return categoryId
}

export function ProductsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = useMemo(() => parsePage(searchParams.get('page')), [searchParams])
  const categoryId = useMemo(() => parseCategoryId(searchParams.get('category')), [searchParams])

  const categoriesQuery = useCategoriesQuery('product')
  const productsQuery = useProductsQuery({ page, perPage: 8, categoryId })

  const result = productsQuery.data?.result
  const products = result?.data ?? []

  function updateSearchParams(nextPage: number, nextCategoryId?: number) {
    const nextParams = new URLSearchParams()

    if (nextPage > 1) {
      nextParams.set('page', String(nextPage))
    }

    if (nextCategoryId) {
      nextParams.set('category', String(nextCategoryId))
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePageChange(nextPage: number) {
    updateSearchParams(nextPage, categoryId)
  }

  function handleCategoryChange(nextCategoryId?: number) {
    updateSearchParams(1, nextCategoryId)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
          {t('common.products')}
        </h1>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">
          {t('catalog.filterByCategory')}
        </h2>
        {categoriesQuery.isLoading ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 shrink-0 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <Card>
            <CardContent className="py-4 text-sm text-destructive">
              {getApiErrorMessage(categoriesQuery.error, t('catalog.loadProductCategoriesError'))}
            </CardContent>
          </Card>
        ) : (
          <CategoryFilter
            categories={categoriesQuery.data?.result ?? []}
            selectedCategoryId={categoryId}
            onCategoryChange={handleCategoryChange}
          />
        )}
      </section>

      {productsQuery.isLoading ? <ProductsGridSkeleton /> : null}

      {!productsQuery.isLoading && productsQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(productsQuery.error, t('catalog.loadProductsError'))}
          </CardContent>
        </Card>
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError ? (
        <section className="space-y-6">
          {products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductPreviewCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                {t('catalog.noProductsMatch')}
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
  )
}
