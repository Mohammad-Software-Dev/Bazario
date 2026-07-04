import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildAssetUrl } from "@/lib/api/asset-url";

import type { SellerListItem } from "@/features/sellers/types/seller.types";

interface SellerPreviewCardProps {
  seller: SellerListItem;
}

export function SellerPreviewCard({ seller }: SellerPreviewCardProps) {
  const imageUrl = buildAssetUrl(seller.logo);
  const contactName = seller.user?.name ?? seller.store_owner_name;

  return (
    <Link
      to={`/sellers/${seller.id}/products`}
      state={{ seller }}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden border-border/70 bg-card/90 pt-0 transition-colors hover:border-foreground/20">
        <div className="aspect-4/3 bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={seller.store_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-sm text-muted-foreground">
              No logo
            </div>
          )}
        </div>

        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{seller.store_name}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-10">
            {seller.description ?? "No description yet."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="font-medium text-foreground">Owner: {contactName}</p>
            <p className="text-muted-foreground">{seller.address}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
