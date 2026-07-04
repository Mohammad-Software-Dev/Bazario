import { useMemo } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { PaginationControls } from "@/components/shared/pagination-controls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ServicePreviewCard } from "@/features/services/components/service-preview-card";
import { useServiceProviderServicesQuery } from "@/features/services/hooks/use-service-provider-services-query";
import type { ServiceProviderProfile } from "@/features/services/types/service.types";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { buildAssetUrl } from "@/lib/api/asset-url";

function ServicesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden pt-0">
          <div className="aspect-4/3 animate-pulse bg-muted" />
          <CardHeader className="space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function parsePage(value: string | null) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function parseServiceProviderId(value: string | undefined) {
  const serviceProviderId = Number(value);

  if (!Number.isInteger(serviceProviderId) || serviceProviderId < 1) {
    return undefined;
  }

  return serviceProviderId;
}

interface ServiceProviderServicesLocationState {
  serviceProvider?: ServiceProviderProfile;
}

export function ServiceProviderServicesPage() {
  const { serviceProviderId: serviceProviderIdParam } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(
    () => parsePage(searchParams.get("page")),
    [searchParams],
  );
  const serviceProviderId = useMemo(
    () => parseServiceProviderId(serviceProviderIdParam),
    [serviceProviderIdParam],
  );
  const locationState =
    location.state as ServiceProviderServicesLocationState | null;

  const serviceProviderServicesQuery = useServiceProviderServicesQuery({
    serviceProviderId,
    page,
    perPage: 8,
  });

  const result = serviceProviderServicesQuery.data?.result.services;
  const services = result?.data ?? [];
  const serviceProvider =
    serviceProviderServicesQuery.data?.result.service_provider ??
    locationState?.serviceProvider;
  const serviceProviderImageUrl = buildAssetUrl(serviceProvider?.logo);

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams();

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!serviceProviderId) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Invalid service provider.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="space-y-4">
        <Link
          to="/service-providers"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to providers
        </Link>

        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              {serviceProvider?.name ?? "Service provider services"}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              {serviceProvider?.description ??
                "Browse this provider published marketplace services."}
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {serviceProvider?.user?.name ? (
                <p>Contact: {serviceProvider.user.name}</p>
              ) : null}
              {serviceProvider?.address ? (
                <p>{serviceProvider.address}</p>
              ) : null}
            </div>
          </div>

          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
            {serviceProviderImageUrl ? (
              <img
                src={serviceProviderImageUrl}
                alt={serviceProvider?.name ?? "Service provider"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                No logo
              </div>
            )}
          </div>
        </div>
      </section>

      {serviceProviderServicesQuery.isLoading ? <ServicesGridSkeleton /> : null}

      {!serviceProviderServicesQuery.isLoading &&
      serviceProviderServicesQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(
              serviceProviderServicesQuery.error,
              "Unable to load this provider services right now.",
            )}
          </CardContent>
        </Card>
      ) : null}

      {!serviceProviderServicesQuery.isLoading &&
      !serviceProviderServicesQuery.isError ? (
        <section className="space-y-6">
          {services.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <ServicePreviewCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                This service provider has no published services yet.
              </CardContent>
            </Card>
          )}

          <PaginationControls
            currentPage={result?.current_page ?? 1}
            lastPage={result?.last_page ?? 1}
            onPageChange={handlePageChange}
          />
        </section>
      ) : null}
    </div>
  );
}
