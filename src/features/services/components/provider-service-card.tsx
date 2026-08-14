import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServiceListItem } from '@/features/services/types/service.types'
import { resolveMediaUrl } from '@/lib/api/asset-url'
import { formatMoney } from '@/lib/i18n/format'
import { getLocalizedValue } from '@/lib/localized-value'

interface ProviderServiceCardProps {
  onDelete: (service: ServiceListItem) => void
  service: ServiceListItem
}

export function ProviderServiceCard({ service, onDelete }: ProviderServiceCardProps) {
  const { t } = useTranslation()
  const imageUrl = resolveMediaUrl(service.images[0]?.image_url, service.images[0]?.image)
  const title = getLocalizedValue(service.title) || t('common.untitledService')
  const description = getLocalizedValue(service.description) || t('common.noDescriptionYet')
  const categoryName = getLocalizedValue(service.category?.name) || t('common.uncategorized')

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-card pt-0 shadow-sm">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="block h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}
      </div>

      <CardHeader className="space-y-1 px-4 pt-3 pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-lg leading-5.5">{title}</CardTitle>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              service.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {service.is_active ? t('details.active') : t('details.inactive')}
          </span>
        </div>
        <CardDescription className="line-clamp-2 text-sm leading-5">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pt-3 pb-4 text-sm">
        <div className="grid gap-2 text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>{t('details.category')}</span>
            <span className="text-foreground">{categoryName}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>{t('details.price')}</span>
            <span className="text-foreground">{formatMoney(service.price)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>{t('details.duration')}</span>
            <span className="text-foreground">{service.duration_minutes ? t('details.minutesShort', { count: service.duration_minutes }) : '-'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="outline">
            <Link to={`/services/${service.id}`}>{t('common.viewDetails')}</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={`/account/provider/services/${service.id}/edit`}>{t('common.edit')}</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(service)}>
            {t('common.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
