import { useTranslation } from "react-i18next";

import { Card, CardContent } from "@/components/ui/card";
import { getApiErrorMessage } from "@/lib/api/api-error";

import { AdsSection } from "@/features/ads/components/ads-section";
import { SponsoredAdsCarousel } from "@/features/ads/components/sponsored-ads-carousel";
import {
  mapAdToViewModel,
} from "@/features/ads/lib/ad-mappers";
import { HomePreviewGridSkeleton } from "@/features/home/components/home-preview-grid-skeleton";
import { HomePreviewSection } from "@/features/home/components/home-preview-section";
import { useHomeQuery } from "@/features/home/hooks/use-home-query";
import { MarketplaceUpdatesCarousel } from "@/features/listings/components/marketplace-updates-carousel";
import { ProductPreviewCard } from "@/features/products/components/product-preview-card";
import { ServicePreviewCard } from "@/features/services/components/service-preview-card";

export function HomePage() {
  const { t } = useTranslation();
  const homeQuery = useHomeQuery({ latestLimit: 8 });

  const products = homeQuery.data?.result.products.latest ?? [];
  const services = homeQuery.data?.result.services.latest ?? [];
  const goldAds = homeQuery.data?.result.ads.gold ?? [];
  const silverAds = homeQuery.data?.result.ads.silver ?? [];
  const normalAds = homeQuery.data?.result.ads.normal ?? [];
  const announcementListings = homeQuery.data?.result.ads.announcements ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:py-12">
      {homeQuery.isLoading ? <HomePreviewGridSkeleton /> : null}

      {!homeQuery.isLoading && homeQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(homeQuery.error, t("home.loadError"))}
          </CardContent>
        </Card>
      ) : null}

      {!homeQuery.isLoading && !homeQuery.isError ? (
        <>
          {announcementListings.length ? (
            <AdsSection title={t("ads.marketplaceUpdates")}>
              <MarketplaceUpdatesCarousel listings={announcementListings} />
            </AdsSection>
          ) : null}

          {goldAds.length ? (
            <AdsSection title={t("ads.goldPlacement")}>
              <SponsoredAdsCarousel
                ads={goldAds.map(mapAdToViewModel)}
                variant="featured"
                itemClassName="basis-[92%] lg:basis-[84%]"
              />
            </AdsSection>
          ) : null}

          {silverAds.length ? (
            <AdsSection title={t("ads.silverPlacement")}>
              <SponsoredAdsCarousel
                ads={silverAds.map(mapAdToViewModel)}
                variant="default"
                itemClassName="basis-[88%] md:basis-[46%]"
              />
            </AdsSection>
          ) : null}

          {normalAds.length ? (
            <AdsSection title={t("ads.normalPlacement")}>
              <SponsoredAdsCarousel
                ads={normalAds.map(mapAdToViewModel)}
                variant="compact"
                itemClassName="basis-[84%] md:basis-[42%] xl:basis-[31%]"
              />
            </AdsSection>
          ) : null}

          <HomePreviewSection
            title={t("home.latestProducts")}
            emptyMessage={t("home.emptyProducts")}
          >
            {products.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductPreviewCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </HomePreviewSection>

          <HomePreviewSection
            title={t("home.latestServices")}
            emptyMessage={t("home.emptyServices")}
          >
            {services.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {services.map((service) => (
                  <ServicePreviewCard key={service.id} service={service} />
                ))}
              </div>
            ) : null}
          </HomePreviewSection>
        </>
      ) : null}
    </div>
  );
}
