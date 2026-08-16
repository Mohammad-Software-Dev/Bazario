import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import type { ServiceListItem } from "@/features/services/types/service.types";
import { resolveMediaUrl } from "@/lib/api/asset-url";
import { formatMoney } from "@/lib/i18n/format";
import { getLocalizedValue } from "@/lib/localized-value";

interface ServicePreviewCardProps {
  service: ServiceListItem;
}

export function ServicePreviewCard({ service }: ServicePreviewCardProps) {
  const { t } = useTranslation();
  const imageUrl = resolveMediaUrl(
    service.images[0]?.image_url,
    service.images[0]?.image,
  );
  const provider = service.service_provider ?? service.serviceProvider ?? null;
  const providerName = provider?.name ?? t("catalog.independentProvider");
  const providerUserName =
    provider?.user?.name ?? t("catalog.providerProfilePending");
  const serviceTitle =
    getLocalizedValue(service.title) || t("common.untitledService");
  const serviceDescription =
    getLocalizedValue(service.description) || t("common.noDescriptionYet");
  const categoryName =
    getLocalizedValue(service.category?.name) || t("common.uncategorized");

  return (
    <Link
      to={`/services/${service.id}`}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={t("catalog.openServiceDetails", { name: serviceTitle })}
    >
      <Card className="flex h-full flex-col overflow-hidden border-0 bg-transparent py-0 shadow-none">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={serviceTitle}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-stone-200 text-sm text-muted-foreground">
              {t("common.noImage")}
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 p-4 pt-1">
          <div className="flex flex-1 flex-col gap-0.5">
            <div className="grid grid-cols-[1fr_auto] items-start gap-2 ">
              <div className="min-w-0">
                <h3 className="line-clamp-2 mb-2 text-lg leading-5.5 font-semibold text-foreground ">
                  {serviceTitle}
                </h3>
              </div>
              {service.isNew ? (
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {t("catalog.new")}
                </span>
              ) : null}
            </div>

            <p className="line-clamp-2 mb-2 text-sm leading-5 text-muted-foreground">
              {serviceDescription}
            </p>

            <div className="mt-auto flex  items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {categoryName}
              </span>
              <span className="text-lg font-semibold text-foreground">
                {formatMoney(service.price)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card px-3 py-1.5 text-sm">
            <p className="line-clamp-1 font-medium text-foreground">{providerName}</p>
            <p className="line-clamp-1 text-muted-foreground">
              {t("catalog.bySeller", { name: providerUserName })}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
