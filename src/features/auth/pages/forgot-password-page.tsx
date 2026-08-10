import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

export function ForgotPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.forgotPasswordTitle')}</CardTitle>
          <CardDescription>{t('auth.forgotPasswordDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ForgotPasswordForm />
          <Button asChild className="w-full" variant="outline">
            <Link to="/">{t('auth.goBackHome')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
