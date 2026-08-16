import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { buildAssetUrl } from "@/lib/api/asset-url";
import { formatMoney } from "@/lib/i18n/format";

import { SponsoredBadge } from "@/features/ads/components/sponsored-badge";
import type { AdViewModel } from "@/features/ads/types/ad.types";

interface SponsoredAdCardProps {
  ad: AdViewModel;
  variant?: "default" | "compact" | "featured";
}

function CardBody({ ad, variant = "default" }: SponsoredAdCardProps) {
  const { t, i18n } = useTranslation();
  const imageUrl = buildAssetUrl(ad.image);
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const titleClassName = isCompact
    ? "mb-2 h-12 text-base leading-6"
    : isFeatured
      ? "mb-2 h-12 text-lg leading-6"
      : "mb-2 h-14 text-xl leading-7";

  return (
    <div className="flex h-full flex-col gap-1">
      <div
        className={`w-full overflow-hidden bg-muted ${
          isCompact
            ? "aspect-16/10"
            : isFeatured
              ? "aspect-16/8"
              : "aspect-video"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={ad.title}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t("common.noImage")}
          </div>
        )}
      </div>

      <div className="space-y-1 px-4 pb-4 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <SponsoredBadge />
        </div>

        <div className="space-y-1">
          <h3
            className={`line-clamp-2 font-semibold text-foreground ${titleClassName}`}
          >
            {ad.title}
          </h3>
          {ad.subtitle ? (
            <p className="line-clamp-2 h-10 text-sm leading-5 text-muted-foreground">
              {ad.subtitle}
            </p>
          ) : (
            <div className="h-10" />
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1 text-sm">
          <div className="min-w-0 space-y-0.5">
            <p className="line-clamp-1 min-h-5 font-medium text-foreground">
              {ad.targetTitle}
            </p>
            {ad.ownerName ? (
              <p className="text-muted-foreground">{ad.ownerName}</p>
            ) : null}
          </div>
          {ad.price !== null ? (
            <p className="shrink-0 self-end font-semibold text-foreground">
              {formatMoney(ad.price, ad.currency, i18n.language)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SponsoredAdCard({
  ad,
  variant = "default",
}: SponsoredAdCardProps) {
  const cardClasses = `block h-full rounded-2xl border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md ${
    variant === "featured" ? "overflow-hidden p-0" : "overflow-hidden p-0"
  }`;

  if (!ad.href) {
    return (
      <Card className={cardClasses}>
        <CardContent className="flex h-full flex-col p-0">
          <CardBody ad={ad} variant={variant} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={ad.href} className={cardClasses}>
      <div className="flex h-full flex-col">
        <CardBody ad={ad} variant={variant} />
      </div>
    </Link>
  );
}
