import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServiceListItem } from '@/features/services/types/service.types'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProviderServiceCardProps {
  onDelete: (service: ServiceListItem) => void
  service: ServiceListItem
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount / 100)
}

export function ProviderServiceCard({ service, onDelete }: ProviderServiceCardProps) {
  const imageUrl = buildAssetUrl(service.images[0]?.image)
  const title = getLocalizedValue(service.title) || 'Untitled service'
  const description = getLocalizedValue(service.description) || 'No description yet.'
  const categoryName = getLocalizedValue(service.category?.name) || 'Uncategorized'

  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-[4/3] bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              service.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {service.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <CardDescription className="line-clamp-2 min-h-10">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-2 text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>Category</span>
            <span className="text-foreground">{categoryName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Price</span>
            <span className="text-foreground">{formatMoney(service.price)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Duration</span>
            <span className="text-foreground">{service.duration_minutes ?? '-'} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/services/${service.id}`}>View</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={`/account/provider/services/${service.id}/edit`}>Edit</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(service)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
