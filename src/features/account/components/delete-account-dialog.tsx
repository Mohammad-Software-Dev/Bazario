import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteAccountMutation } from '@/features/account/hooks/use-delete-account-mutation'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { clearSession } = useAuth()
  const deleteAccountMutation = useDeleteAccountMutation()
  const [password, setPassword] = useState('')

  const passwordError = getApiFieldErrors(deleteAccountMutation.error)?.password?.[0]

  function handleClose(nextOpen: boolean) {
    if (!deleteAccountMutation.isPending) {
      onOpenChange(nextOpen)
    }
  }

  function handleDeleteAccount() {
    deleteAccountMutation.mutate(
      { password },
      {
        onSuccess: () => {
          clearSession()
          onOpenChange(false)
          navigate('/')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('account.deleteAccountDialogTitle')}</DialogTitle>
          <DialogDescription>{t('account.deleteAccountDialogDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-account-password">{t('account.currentPassword')}</Label>
          <Input
            id="delete-account-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
          {deleteAccountMutation.isError && !passwordError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(deleteAccountMutation.error, t('account.deleteAccountError'))}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleClose(false)} disabled={deleteAccountMutation.isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteAccountMutation.isPending || !password.trim()}>
            {deleteAccountMutation.isPending ? t('account.deletingAccount') : t('account.deleteAccount')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
