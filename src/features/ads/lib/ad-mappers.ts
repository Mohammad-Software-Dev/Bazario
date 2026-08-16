import { resolveMediaUrl } from "@/lib/api/asset-url";
import { getLocalizedValue } from "@/lib/localized-value";

import type {
  Ad,
  AdTargetType,
  AdTier,
  AdViewModel,
} from "@/features/ads/types/ad.types";

const modelTypeMap: Record<string, AdTargetType> = {
  "App\\Models\\Product": "product",
  "App\\Models\\Service": "service",
  "App\\Models\\Seller": "seller",
  "App\\Models\\ServiceProvider": "service_provider",
};

const positionTierMap: Record<string, AdTier> = {
  golden_ad: "gold",
  silver_ad: "silver",
  normal_ad: "normal",
};

export function normalizeAdTargetType(
  adableType: string | null | undefined,
): AdTargetType | null {
  if (!adableType) {
    return null;
  }

  return modelTypeMap[adableType] ?? null;
}

export function normalizeAdTier(
  positionName: string | null | undefined,
): AdTier | null {
  if (!positionName) {
    return null;
  }

  return positionTierMap[positionName] ?? null;
}

export function getAdTargetHref(ad: Ad): string | null {
  const targetType = normalizeAdTargetType(ad.adable_type);

  if (!targetType || !ad.adable_id) {
    return null;
  }

  if (targetType === "product") {
    return `/products/${ad.adable_id}`;
  }

  if (targetType === "service") {
    return `/services/${ad.adable_id}`;
  }

  if (targetType === "seller") {
    return `/sellers/${ad.adable_id}/products`;
  }

  if (targetType === "service_provider") {
    return `/service-providers/${ad.adable_id}/services`;
  }

  return null;
}

function getAdImageUrl(ad: Ad): string | null {
  const firstImage = ad.images[0] as
    | ((typeof ad.images)[number] & { path?: string | null })
    | undefined;

  return resolveMediaUrl(firstImage?.image_url, firstImage?.path);
}

function ensureString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getTargetTitle(ad: Ad): string {
  const targetType = normalizeAdTargetType(ad.adable_type);
  const target = ad.adable;

  if (!targetType || !target) {
    return ad.title;
  }

  if (targetType === "product" && "name" in target) {
    return getLocalizedValue(target.name) || ad.title;
  }

  if (targetType === "service" && "title" in target) {
    return getLocalizedValue(target.title) || ad.title;
  }

  if (targetType === "seller" && "store_name" in target) {
    return target.store_name || ad.title;
  }

  if (targetType === "service_provider" && "name" in target) {
    return ensureString(target.name, ad.title) || ad.title;
  }

  return ad.title;
}

function getTargetDescription(ad: Ad): string | null {
  const targetType = normalizeAdTargetType(ad.adable_type);
  const target = ad.adable;

  if (!targetType || !target) {
    return ad.subtitle;
  }

  if (targetType === "product" && "description" in target) {
    return getLocalizedValue(target.description) || ad.subtitle;
  }

  if (targetType === "service" && "description" in target) {
    return getLocalizedValue(target.description) || ad.subtitle;
  }

  if ("description" in target && typeof target.description === "string") {
    return target.description || ad.subtitle;
  }

  return ad.subtitle;
}

function getOwnerName(ad: Ad): string | null {
  const targetType = normalizeAdTargetType(ad.adable_type);
  const target = ad.adable;

  if (!targetType || !target) {
    return null;
  }

  if (targetType === "product" && "seller" in target) {
    return target.seller?.store_name ?? target.seller?.user?.name ?? null;
  }

  if (
    targetType === "service" &&
    ("serviceProvider" in target || "service_provider" in target)
  ) {
    const provider =
      ("service_provider" in target
        ? target.service_provider
        : target.serviceProvider) ?? null;
    return provider?.name ?? provider?.user?.name ?? null;
  }

  if (targetType === "seller" && "store_name" in target) {
    return target.store_name ?? target.user?.name ?? null;
  }

  if (targetType === "service_provider" && "name" in target) {
    return ensureString(target.name) || null;
  }

  return null;
}

function getTargetPrice(ad: Ad): number | null {
  const targetType = normalizeAdTargetType(ad.adable_type);
  const target = ad.adable;

  if (!targetType || !target) {
    return null;
  }

  if (
    (targetType === "product" || targetType === "service") &&
    "price" in target
  ) {
    const rawPrice = target.price;
    const priceValue =
      typeof rawPrice === "number"
        ? rawPrice
        : typeof rawPrice === "string"
          ? Number.parseFloat(rawPrice)
          : null;

    return priceValue !== null && Number.isFinite(priceValue)
      ? priceValue
      : null;
  }

  return null;
}

export function mapAdToViewModel(ad: Ad): AdViewModel {
  const priceValue =
    typeof ad.price === "number"
      ? ad.price
      : typeof ad.price === "string"
        ? Number.parseFloat(ad.price)
        : null;
  const refund = ad.refund;
  const refundApplied = refund?.applied === true;
  const paymentState: AdViewModel["paymentState"] = refundApplied
    ? "refunded"
    : ad.status === "rejected" && ad.paid_at
      ? "refunded"
      : ad.paid_at
        ? "paid"
        : "payment_required";

  return {
    id: ad.id,
    title: ad.title,
    subtitle: ad.subtitle,
    tier: normalizeAdTier(ad.position?.name),
    targetType: normalizeAdTargetType(ad.adable_type),
    image: getAdImageUrl(ad),
    targetTitle: getTargetTitle(ad),
    targetDescription: getTargetDescription(ad),
    ownerName: getOwnerName(ad),
    href: getAdTargetHref(ad),
    price:
      priceValue !== null && Number.isFinite(priceValue) ? priceValue : null,
    targetPrice: getTargetPrice(ad),
    currency: ad.currency_iso ?? "EUR",
    status: ad.status,
    paymentState,
    expiresAt: ad.expires_at,
    createdAt: ad.created_at,
  };
}
