import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceProviderUpgradeForm } from '@/features/account/components/service-provider-upgrade-form'

export function ServiceProviderUpgradePage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('provider.upgradeTitle')}</CardTitle>
          <CardDescription>{t('provider.upgradeDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ServiceProviderUpgradeForm />
          <Button asChild variant="ghost" className="px-0">
            <Link to="/account">{t('common.backToAccount')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
