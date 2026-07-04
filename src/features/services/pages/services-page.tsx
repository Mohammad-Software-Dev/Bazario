import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CategoryFilter } from "@/features/categories/components/category-filter";
import { useCategoriesQuery } from "@/features/categories/hooks/use-categories-query";
import { ServicePreviewCard } from "@/features/services/components/service-preview-card";
import { useServicesQuery } from "@/features/services/hooks/use-services-query";
import { getApiErrorMessage } from "@/lib/api/api-error";

function ServicesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
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
  );
}

function parsePage(value: string | null) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function parseCategoryId(value: string | null) {
  const categoryId = Number(value);

  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return undefined;
  }

  return categoryId;
}

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const categoryId = useMemo(
    () => parseCategoryId(searchParams.get("category")),
    [searchParams],
  );

  const categoriesQuery = useCategoriesQuery("service");
  const servicesQuery = useServicesQuery({ page, perPage: 8, categoryId });

  const result = servicesQuery.data?.result;
  const services = result?.data ?? [];

  function updateSearchParams(nextPage: number, nextCategoryId?: number) {
    const nextParams = new URLSearchParams();

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    if (nextCategoryId) {
      nextParams.set("category", String(nextCategoryId));
    }

    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageChange(nextPage: number) {
    updateSearchParams(nextPage, categoryId);
  }

  function handleCategoryChange(nextCategoryId?: number) {
    updateSearchParams(1, nextCategoryId);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
          Services
        </h1>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">
          Filter by category
        </h2>
        {categoriesQuery.isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : categoriesQuery.isError ? (
          <Card>
            <CardContent className="py-4 text-sm text-destructive">
              {getApiErrorMessage(
                categoriesQuery.error,
                "Unable to load service categories right now.",
              )}
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

      {servicesQuery.isLoading ? <ServicesGridSkeleton /> : null}

      {!servicesQuery.isLoading && servicesQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(
              servicesQuery.error,
              "Unable to load services right now.",
            )}
          </CardContent>
        </Card>
      ) : null}

      {!servicesQuery.isLoading && !servicesQuery.isError ? (
        <section className="space-y-6">
          {services.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <ServicePreviewCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No services matched the selected category.
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
  );
}
