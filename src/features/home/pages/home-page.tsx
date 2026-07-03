import { Card, CardContent } from '@/components/ui/card'
import { getApiErrorMessage } from '@/lib/api/api-error'

import { HomePreviewGridSkeleton } from '@/features/home/components/home-preview-grid-skeleton'
import { HomePreviewSection } from '@/features/home/components/home-preview-section'
import { useHomeQuery } from '@/features/home/hooks/use-home-query'
import { ProductPreviewCard } from '@/features/products/components/product-preview-card'
import { ServicePreviewCard } from '@/features/services/components/service-preview-card'

export function HomePage() {
  const homeQuery = useHomeQuery({ latestLimit: 8 })

  const products = homeQuery.data?.result.products.latest ?? []
  const services = homeQuery.data?.result.services.latest ?? []

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:py-12">
      <section className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
          Explore Bazario
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Browse the latest products and services from the marketplace. This page stays simple and
          uses a single backend home endpoint to keep the frontend easy to follow.
        </p>
      </section>

      {homeQuery.isLoading ? <HomePreviewGridSkeleton /> : null}

      {!homeQuery.isLoading && homeQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(homeQuery.error, 'Unable to load the home page right now.')}
          </CardContent>
        </Card>
      ) : null}

      {!homeQuery.isLoading && !homeQuery.isError ? (
        <>
          <HomePreviewSection
            title="Latest products"
            description="A quick preview of recently added marketplace products."
            emptyMessage="No products are available yet."
          >
            {products.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductPreviewCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </HomePreviewSection>

          <HomePreviewSection
            title="Latest services"
            description="A quick preview of recently added marketplace services."
            emptyMessage="No services are available yet."
          >
            {services.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {services.map((service) => (
                  <ServicePreviewCard key={service.id} service={service} />
                ))}
              </div>
            ) : null}
          </HomePreviewSection>
        </>
      ) : null}
    </div>
  )
}
