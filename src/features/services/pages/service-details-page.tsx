import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceBookingCard } from '@/features/services/components/service-booking-card'
import { useServiceQuery } from '@/features/services/hooks/use-service-query'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { getLocalizedValue } from '@/lib/localized-value'

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function parseServiceId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function ServiceDetailsPage() {
  const { serviceId: serviceIdParam } = useParams()
  const serviceId = parseServiceId(serviceIdParam)
  const serviceQuery = useServiceQuery(serviceId ?? 0, Boolean(serviceId))

  if (!serviceId) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">Invalid service id.</CardContent>
        </Card>
      </div>
    )
  }

  if (serviceQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card className="overflow-hidden pt-0">
          <div className="aspect-[16/9] animate-pulse bg-muted" />
          <CardHeader className="space-y-2">
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (serviceQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(serviceQuery.error, 'Unable to load this service right now.')}
          </CardContent>
        </Card>
      </div>
    )
  }

  const service = serviceQuery.data?.result

  if (!service) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">Service not found.</CardContent>
        </Card>
      </div>
    )
  }

  const serviceTitle = getLocalizedValue(service.title) || 'Untitled service'
  const serviceDescription = getLocalizedValue(service.description) || 'No description yet.'
  const categoryName = getLocalizedValue(service.category?.name) || 'Uncategorized'
  const provider = service.service_provider ?? service.serviceProvider ?? null
  const providerName = provider?.name ?? 'Independent provider'
  const providerUserName = provider?.user?.name ?? 'Provider profile pending'
  const images = service.images.map((image) => buildAssetUrl(image.image)).filter(Boolean) as string[]
  const primaryImage = images[0] ?? null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Service details</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">{serviceTitle}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/services">Back to services</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden pt-0">
          <div className="aspect-[16/10] bg-muted">
            {primaryImage ? (
              <img src={primaryImage} alt={serviceTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-stone-200 text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          {images.length > 1 ? (
            <CardContent className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3">
              {images.slice(1).map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border bg-muted">
                  <img src={image} alt={`${serviceTitle} ${index + 2}`} className="aspect-4/3 h-full w-full object-cover" />
                </div>
              ))}
            </CardContent>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold text-foreground">{formatMoney(service.price)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground">{categoryName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Provider</span>
                <span className="text-foreground">{providerName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Contact</span>
                <span className="text-foreground">{providerUserName}</span>
              </div>
            </CardContent>
          </Card>

          <ServiceBookingCard service={service} />

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{serviceDescription}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
