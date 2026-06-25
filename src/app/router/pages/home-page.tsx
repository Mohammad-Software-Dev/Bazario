import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api/api-error";

import { ProductPreviewCard } from "@/features/products/components/product-preview-card";
import { useProductsQuery } from "@/features/products/hooks/use-products-query";
import { ServicePreviewCard } from "@/features/services/components/service-preview-card";
import { useServicesQuery } from "@/features/services/hooks/use-services-query";

function PreviewSectionSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden pt-0">
          <div className="aspect-4/3 animate-pulse bg-muted" />
          <CardHeader className="space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface PreviewSectionProps {
  title: string;
  description: string;
  emptyMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
}

function PreviewSection({
  title,
  description,
  emptyMessage,
  errorMessage,
  isLoading,
  isError,
  children,
}: PreviewSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {isLoading ? <PreviewSectionSkeleton /> : null}
      {!isLoading && isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {errorMessage}
          </CardContent>
        </Card>
      ) : null}
      {!isLoading && !isError ? children : null}
      {!isLoading && !isError && !children ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

export function HomePage() {
  const productsQuery = useProductsQuery({ page: 1 });
  const servicesQuery = useServicesQuery({ page: 1 });

  const products = productsQuery.data?.result.data.slice(0, 4) ?? [];
  const services = servicesQuery.data?.result.data.slice(0, 4) ?? [];

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(214,211,209,0.24),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,245,244,0.92))]">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 md:pb-20">
        <PreviewSection
          title="Fresh products"
          description="Latest product listings "
          emptyMessage="No products are available yet."
          errorMessage={getApiErrorMessage(
            productsQuery.error,
            "Unable to load products right now.",
          )}
          isLoading={productsQuery.isLoading}
          isError={productsQuery.isError}
        >
          {products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductPreviewCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </PreviewSection>

        <PreviewSection
          title="Newest services"
          description="Latest service listings"
          emptyMessage="No services are available yet."
          errorMessage={getApiErrorMessage(
            servicesQuery.error,
            "Unable to load services right now.",
          )}
          isLoading={servicesQuery.isLoading}
          isError={servicesQuery.isError}
        >
          {services.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <ServicePreviewCard key={service.id} service={service} />
              ))}
            </div>
          ) : null}
        </PreviewSection>
      </section>
    </div>
  );
}
