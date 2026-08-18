import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import type { ProductListItem } from "@/features/products/types/product.types";
import { resolveMediaUrl } from "@/lib/api/asset-url";
import { formatMoney } from "@/lib/i18n/format";
import { getLocalizedValue } from "@/lib/localized-value";

interface ProductPreviewCardProps {
  product: ProductListItem;
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const { t } = useTranslation();
  const imageUrl = resolveMediaUrl(
    product.images[0]?.image_url,
    product.images[0]?.image,
  );
  const storeName =
    product.seller?.store_name ?? t("catalog.independentSeller");
  const sellerUserName =
    product.seller?.user?.name ?? t("catalog.sellerProfilePending");
  const productName =
    getLocalizedValue(product.name) || t("common.untitledProduct");
  const productDescription =
    getLocalizedValue(product.description) || t("common.noDescriptionYet");
  const categoryName =
    getLocalizedValue(product.category?.name) || t("common.uncategorized");

  return (
    <Link
      to={`/products/${product.id}`}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={t("catalog.openProductDetails", { name: productName })}
    >
      <Card className="flex h-full flex-col overflow-hidden border-0 bg-transparent py-0 shadow-none">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-accent text-sm text-muted-foreground">
              {t("common.noImage")}
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 p-4 pt-1">
          <div className="flex flex-1 flex-col gap-0.5">
            <div className="grid grid-cols-[1fr_auto] items-start gap-2 ">
              <div className="min-w-0">
                <h3 className="line-clamp-2 mb-2 text-lg leading-5.5 font-semibold text-foreground ">
                  {productName}
                </h3>
              </div>
              {product.isNew ? (
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {t("catalog.new")}
                </span>
              ) : null}
            </div>

            <p className="line-clamp-2 mb-2 text-sm leading-5 text-muted-foreground">
              {productDescription}
            </p>

            <div className="mt-auto flex  items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {categoryName}
              </span>
              <span className="text-lg font-semibold text-foreground">
                {formatMoney(product.price)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card px-3 py-1.5 text-sm">
            <p className="line-clamp-1 font-medium text-foreground">
              {storeName}
            </p>
            <p className="line-clamp-1 text-muted-foreground">
              {t("catalog.bySeller", { name: sellerUserName })}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
