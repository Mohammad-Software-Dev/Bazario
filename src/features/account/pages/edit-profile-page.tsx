import { useTranslation } from 'react-i18next'

import { Card, CardContent } from '@/components/ui/card'
import { EditProfileForm } from '@/features/account/components/edit-profile-form'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function EditProfilePage() {
  const { t } = useTranslation()
  const meQuery = useMeQuery(false)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">{t('common.account')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t('profile.editProfile')}</h1>
        <p className="text-sm text-muted-foreground">{t('profile.editProfileDescription')}</p>
      </div>

      {meQuery.isLoading ? <p className="text-sm text-muted-foreground">{t('profile.loadingProfile')}</p> : null}

      {meQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(meQuery.error, t('profile.loadProfileError'))}
          </CardContent>
        </Card>
      ) : null}

      {meQuery.data?.result.user ? <EditProfileForm user={meQuery.data.result.user} /> : null}
    </div>
  )
}
