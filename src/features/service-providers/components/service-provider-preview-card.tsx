import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveMediaUrl } from "@/lib/api/asset-url";

import type { ServiceProviderListItem } from "@/features/service-providers/types/service-provider.types";

interface ServiceProviderPreviewCardProps {
  serviceProvider: ServiceProviderListItem;
}

export function ServiceProviderPreviewCard({
  serviceProvider,
}: ServiceProviderPreviewCardProps) {
  const { t } = useTranslation();
  const imageUrl = resolveMediaUrl(serviceProvider.logo_url, serviceProvider.logo);
  const contactName = serviceProvider.user?.name ?? serviceProvider.name;

  return (
    <Link
      to={`/service-providers/${serviceProvider.id}/services`}
      state={{ serviceProvider }}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden rounded-2xl border-border/70 bg-card pt-0 shadow-sm transition-colors hover:border-foreground/20">
        <div className="aspect-4/3 w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={serviceProvider.name}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent to-muted text-sm text-muted-foreground">
              No logo
            </div>
          )}
        </div>

        <CardHeader className="space-y-1 px-4 pt-3 pb-0">
          <CardTitle className="line-clamp-2 text-lg leading-5.5">{serviceProvider.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm leading-5">
            {serviceProvider.description ?? t("common.noDescriptionYet")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 px-4 pt-3 pb-4 text-sm">
          <div className="rounded-xl border border-border/70 bg-card px-3 py-1.5">
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
