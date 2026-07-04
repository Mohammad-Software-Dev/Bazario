import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SellerPreviewCard } from "@/features/sellers/components/seller-preview-card";
import { useSellersQuery } from "@/features/sellers/hooks/use-sellers-query";
import { getApiErrorMessage } from "@/lib/api/api-error";

function SellersGridSkeleton() {
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
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

export function SellersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const sellersQuery = useSellersQuery({ page, perPage: 8 });

  const result = sellersQuery.data?.result;
  const sellers = result?.data ?? [];

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage <= 1) nextParams.delete("page");
    else nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
          Sellers
        </h1>
      </section>

      {sellersQuery.isLoading ? <SellersGridSkeleton /> : null}

      {!sellersQuery.isLoading && sellersQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(
              sellersQuery.error,
              "Unable to load sellers right now.",
            )}
          </CardContent>
        </Card>
      ) : null}

      {!sellersQuery.isLoading && !sellersQuery.isError ? (
        <section className="space-y-6">
          {sellers.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {sellers.map((seller) => (
                <SellerPreviewCard key={seller.id} seller={seller} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                No sellers are available yet.
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
