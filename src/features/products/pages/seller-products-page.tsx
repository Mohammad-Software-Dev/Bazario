import { useMemo } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProductPreviewCard } from "@/features/products/components/product-preview-card";
import { useSellerProductsQuery } from "@/features/products/hooks/use-seller-products-query";
import type { ProductSeller } from "@/features/products/types/product.types";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { buildAssetUrl } from "@/lib/api/asset-url";

function ProductsGridSkeleton() {
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

function parseSellerId(value: string | undefined) {
  const sellerId = Number(value);

  if (!Number.isInteger(sellerId) || sellerId < 1) {
    return undefined;
  }

  return sellerId;
}

interface SellerProductsLocationState {
  seller?: ProductSeller;
}

export function SellerProductsPage() {
  const { sellerId: sellerIdParam } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const sellerId = useMemo(() => parseSellerId(sellerIdParam), [sellerIdParam]);
  const locationState = location.state as SellerProductsLocationState | null;

  const sellerProductsQuery = useSellerProductsQuery({
    sellerId,
    page,
    perPage: 8,
  });

  const result = sellerProductsQuery.data?.result.products;
  const products = result?.data ?? [];
  const seller =
    sellerProductsQuery.data?.result.seller ?? locationState?.seller;
  const sellerImageUrl = buildAssetUrl(seller?.logo);

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams();

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!sellerId) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Invalid seller.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="space-y-4">
        <Link
          to="/sellers"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to sellers
        </Link>

        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              {seller?.store_name ?? "Seller products"}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {seller?.description ??
                "Browse this seller published marketplace products."}
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {seller?.store_owner_name ? (
                <p>Owner: {seller.store_owner_name}</p>
              ) : null}
              {seller?.address ? <p>{seller.address}</p> : null}
            </div>
          </div>

          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
            {sellerImageUrl ? (
              <img
                src={sellerImageUrl}
                alt={seller?.store_name ?? "Seller"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No logo
              </div>
            )}
          </div>
        </div>
      </section>

      {sellerProductsQuery.isLoading ? <ProductsGridSkeleton /> : null}

      {!sellerProductsQuery.isLoading && sellerProductsQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(
              sellerProductsQuery.error,
              "Unable to load this seller products right now.",
            )}
          </CardContent>
        </Card>
      ) : null}

      {!sellerProductsQuery.isLoading && !sellerProductsQuery.isError ? (
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
                This seller has no published products yet.
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
