import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildAssetUrl } from "@/lib/api/asset-url";
import { getLocalizedValue } from "@/lib/localized-value";

import type { ProductListItem } from "@/features/products/types/product.types";

interface ProductPreviewCardProps {
  product: ProductListItem;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const imageUrl = buildAssetUrl(product.images[0]?.image);
  const storeName = product.seller?.store_name ?? "Independent seller";
  const sellerUserName = product.seller?.user?.name ?? "Seller profile pending";
  const productName = getLocalizedValue(product.name) ?? "Untitled product";
  const productDescription =
    getLocalizedValue(product.description) ?? "No description yet.";
  const categoryName =
    getLocalizedValue(product.category?.name) ?? "Uncategorized";

  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 pt-0">
      <div className="aspect-4/3 bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-stone-100 to-stone-200 text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1">{productName}</CardTitle>
          {product.isNew ? (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              New
            </span>
          ) : null}
        </div>
        <CardDescription className="line-clamp-2 min-h-10">
          {productDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{categoryName}</span>
          <span className="font-semibold text-foreground">
            {formatMoney(product.price)}
          </span>
        </div>

        <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <p className="font-medium text-foreground">{storeName}</p>
          <p className="text-muted-foreground">by {sellerUserName}</p>
        </div>
      </CardContent>
    </Card>
  );
}
