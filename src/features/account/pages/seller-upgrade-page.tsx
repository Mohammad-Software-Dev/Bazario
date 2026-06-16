import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SellerUpgradeForm } from '@/features/account/components/seller-upgrade-form'

export function SellerUpgradePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Upgrade to seller</CardTitle>
          <CardDescription>Submit your seller application with store details and optional uploads.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SellerUpgradeForm />
          <Button asChild variant="ghost" className="px-0">
            <Link to="/account">Back to account</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
