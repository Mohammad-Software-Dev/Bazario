import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginForm } from '@/features/auth/components/login-form'
import { useUiStore } from '@/stores/ui-store'

export function LoginDialog() {
  const { t } = useTranslation()
  const isLoginDialogOpen = useUiStore((state) => state.isLoginDialogOpen)
  const setLoginDialogOpen = useUiStore((state) => state.setLoginDialogOpen)

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('auth.loginTitle')}</DialogTitle>
          <DialogDescription>{t('auth.loginDescription')}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <LoginForm onSuccess={() => setLoginDialogOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
