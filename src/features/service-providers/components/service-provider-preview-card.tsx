import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildAssetUrl } from "@/lib/api/asset-url";

import type { ServiceProviderListItem } from "@/features/service-providers/types/service-provider.types";

interface ServiceProviderPreviewCardProps {
  serviceProvider: ServiceProviderListItem;
}

export function ServiceProviderPreviewCard({
  serviceProvider,
}: ServiceProviderPreviewCardProps) {
  const imageUrl = buildAssetUrl(serviceProvider.logo);
  const contactName = serviceProvider.user?.name ?? serviceProvider.name;

  return (
    <Link
      to={`/service-providers/${serviceProvider.id}/services`}
      state={{ serviceProvider }}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden border-border/70 bg-card/90 pt-0 transition-colors hover:border-foreground/20">
        <div className="aspect-4/3 bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={serviceProvider.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-stone-200 text-sm text-muted-foreground">
              No logo
            </div>
          )}
        </div>

        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1">{serviceProvider.name}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-10">
            {serviceProvider.description ?? "No description yet."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <p className="font-medium text-foreground">
              Contact: {contactName}
            </p>
            <p className="text-muted-foreground">{serviceProvider.address}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
