import { useTranslation } from 'react-i18next'

import { ChangePasswordForm } from '@/features/account/components/change-password-form'

export function ChangePasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('common.account')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('password.title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('password.pageDescription')}</p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
