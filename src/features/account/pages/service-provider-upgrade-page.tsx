import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceProviderUpgradeForm } from '@/features/account/components/service-provider-upgrade-form'

export function ServiceProviderUpgradePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade to service provider</CardTitle>
          <CardDescription>Submit your service provider application with your business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ServiceProviderUpgradeForm />
          <Button asChild variant="ghost" className="px-0">
            <Link to="/account">Back to account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
