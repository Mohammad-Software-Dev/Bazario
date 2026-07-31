import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterForm } from '@/features/auth/components/register-form'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('auth.registerPageTitle')}</CardTitle>
          <CardDescription>{t('auth.registerPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link
              className="font-medium text-foreground underline underline-offset-4"
              to="/"
            >
              {t('auth.goBackHome')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
