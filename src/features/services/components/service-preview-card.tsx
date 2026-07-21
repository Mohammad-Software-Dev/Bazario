import { Link } from 'react-router-dom'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServiceListItem } from '@/features/services/types/service.types'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { getLocalizedValue } from '@/lib/localized-value'

interface ServicePreviewCardProps {
  service: ServiceListItem
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function ServicePreviewCard({ service }: ServicePreviewCardProps) {
  const imageUrl = buildAssetUrl(service.images[0]?.image)
  const provider = service.service_provider ?? service.serviceProvider ?? null
  const providerName = provider?.name ?? 'Independent provider'
  const providerUserName = provider?.user?.name ?? 'Provider profile pending'
  const serviceTitle = getLocalizedValue(service.title) ?? 'Untitled service'
  const serviceDescription = getLocalizedValue(service.description) ?? 'No description yet.'
  const categoryName = getLocalizedValue(service.category?.name) ?? 'Uncategorized'

  return (
    <Link
      to={`/services/${service.id}`}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="overflow-hidden border-border/70 bg-card/90 pt-0 transition-colors hover:border-foreground/20">
        <div className="aspect-4/3 bg-muted">
          {imageUrl ? (
            <img src={imageUrl} alt={serviceTitle} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-stone-200 text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-1">{serviceTitle}</CardTitle>
            {service.isNew ? (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                New
              </span>
            ) : null}
          </div>
          <CardDescription className="line-clamp-2 min-h-10">{serviceDescription}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{categoryName}</span>
            <span className="font-semibold text-foreground">{formatMoney(service.price)}</span>
          </div>

          <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
            <p className="font-medium text-foreground">{providerName}</p>
            <p className="text-muted-foreground">by {providerUserName}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
