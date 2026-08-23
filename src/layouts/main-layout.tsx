import { useTranslation } from 'react-i18next'
import { Outlet, useNavigation } from 'react-router-dom'

import { AppHeader } from '@/components/shared/app-header'
import { LoginDialog } from '@/features/auth/components/login-dialog'

export function MainLayout() {
  const { t } = useTranslation()
  const navigation = useNavigation()
  // The router reports "loading" while a lazily imported route module is
  // still being fetched, so this covers the gap before the next view renders.
  const isViewLoading = navigation.state === 'loading'

  return (
    <div className="min-h-screen bg-background">
      {isViewLoading ? (
        <div
          role="status"
          aria-label={t('common.loadingView')}
          className="fixed inset-x-0 top-0 z-50 h-1 animate-pulse bg-primary"
        />
      ) : null}
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <LoginDialog />
    </div>
  )
}
