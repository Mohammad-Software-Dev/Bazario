import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyResetOtpForm } from '@/features/auth/components/verify-reset-otp-form'

export function VerifyResetOtpPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.verifyResetOtpTitle')}</CardTitle>
          <CardDescription>{t('auth.verifyResetOtpDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <VerifyResetOtpForm />
          <Button asChild className="w-full" variant="outline">
            <Link to="/forgot-password">{t('common.previous')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
