import { ChangePasswordForm } from '@/features/account/components/change-password-form'

export function ChangePasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Change password</h1>
        <p className="text-sm text-muted-foreground">
          Keep your account secure by choosing a strong new password.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  )
}
