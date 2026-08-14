import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveMediaUrl } from "@/lib/api/asset-url";

import type { SellerListItem } from "@/features/sellers/types/seller.types";

interface SellerPreviewCardProps {
  seller: SellerListItem;
}

export function SellerPreviewCard({ seller }: SellerPreviewCardProps) {
  const imageUrl = resolveMediaUrl(seller.logo_url, seller.logo);
  const contactName = seller.user?.name ?? seller.store_owner_name;

  return (
    <Link
      to={`/sellers/${seller.id}/products`}
      state={{ seller }}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-card pt-0 shadow-sm transition-colors hover:border-foreground/20">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={seller.store_name}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-sm text-muted-foreground">
              No logo
            </div>
          )}
        </div>

        <CardHeader className="space-y-1 px-4 pt-3 pb-0">
          <CardTitle className="line-clamp-2 text-lg leading-5.5">{seller.store_name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm leading-5">
            {seller.description ?? "No description yet."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pt-3 pb-4 text-sm">
          <div className="rounded-xl border border-border/70 bg-card px-3 py-1.5">
            <p className="font-medium text-foreground">Owner: {contactName}</p>
            <p className="text-muted-foreground">{seller.address}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
