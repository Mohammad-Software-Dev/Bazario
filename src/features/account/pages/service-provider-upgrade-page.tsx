import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceProviderUpgradeForm } from '@/features/account/components/service-provider-upgrade-form'
import { useUpgradeEligibility } from '@/features/account/hooks/use-upgrade-eligibility'

export function ServiceProviderUpgradePage() {
  const { t } = useTranslation()
  const { isChecking, canApply } = useUpgradeEligibility('service_provider')

  if (isChecking) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 text-sm text-muted-foreground">
        {t('profile.loadingAccount')}
      </div>
    )
  }

  if (!canApply) {
    return <Navigate replace to="/account" />
  }

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
