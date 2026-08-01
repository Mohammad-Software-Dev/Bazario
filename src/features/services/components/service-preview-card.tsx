import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent } from '@/components/ui/card'
import type { ServiceListItem } from '@/features/services/types/service.types'
import { buildAssetUrl } from '@/lib/api/asset-url'
import { formatMoney } from '@/lib/i18n/format'
import { getLocalizedValue } from '@/lib/localized-value'

interface ServicePreviewCardProps {
  service: ServiceListItem
}

export function ServicePreviewCard({ service }: ServicePreviewCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const imageUrl = buildAssetUrl(service.images[0]?.image)
  const provider = service.service_provider ?? service.serviceProvider ?? null
  const providerName = provider?.name ?? t('catalog.independentProvider')
  const providerUserName = provider?.user?.name ?? t('catalog.providerProfilePending')
  const serviceTitle = getLocalizedValue(service.title) || t('common.untitledService')
  const serviceDescription = getLocalizedValue(service.description) || t('common.noDescriptionYet')
  const categoryName = getLocalizedValue(service.category?.name) || t('common.uncategorized')

  function handleOpenService() {
    navigate(`/services/${service.id}`)
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenService()
    }
  }

  return (
    <Card
      className="flex h-full cursor-pointer flex-col overflow-hidden border-border/70 bg-card/90 pt-0 shadow-sm transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      role="link"
      tabIndex={0}
      onClick={handleOpenService}
      onKeyDown={handleCardKeyDown}
    >
      <div className="aspect-4/3 bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={serviceTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-stone-200 text-sm text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="min-h-[3.5rem] line-clamp-2 text-lg font-semibold text-foreground">{serviceTitle}</h3>
            </div>
            {service.isNew ? (
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {t('catalog.new')}
              </span>
            ) : null}
          </div>

          <p className="min-h-[3.5rem] line-clamp-2 text-sm text-muted-foreground">{serviceDescription}</p>

          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {categoryName}
            </span>
            <span className="text-lg font-semibold text-foreground">{formatMoney(service.price)}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
          <p className="line-clamp-1 font-medium text-foreground">{providerName}</p>
          <p className="line-clamp-1 text-muted-foreground">{t('catalog.bySeller', { name: providerUserName })}</p>
        </div>
      </CardContent>
    </Card>
  )
}
