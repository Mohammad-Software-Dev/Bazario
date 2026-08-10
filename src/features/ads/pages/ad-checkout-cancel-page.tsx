import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdCheckoutCancelPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{t('ads.workspaceEyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">{t('ads.checkoutCancelTitle')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('ads.checkoutCancelHeading')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">{t('ads.checkoutCancelDescription')}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/account/ads">{t('ads.manageAds')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account/ads/new">{t('ads.createAd')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
