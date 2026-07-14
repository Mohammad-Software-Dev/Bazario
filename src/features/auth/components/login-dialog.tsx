import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoginForm } from '@/features/auth/components/login-form'
import { useUiStore } from '@/stores/ui-store'

export function LoginDialog() {
  const isLoginDialogOpen = useUiStore((state) => state.isLoginDialogOpen)
  const setLoginDialogOpen = useUiStore((state) => state.setLoginDialogOpen)

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setLoginDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>Enter your email and password to continue.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <LoginForm onSuccess={() => setLoginDialogOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
