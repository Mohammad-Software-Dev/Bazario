import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPasswordMutation } from '@/features/auth/hooks/use-reset-password-mutation'
import {
  clearPasswordResetFlow,
  getPasswordResetEmail,
  getPasswordResetToken,
} from '@/features/auth/lib/password-reset-storage'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/reset-password-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useUiStore } from '@/stores/ui-store'

export function ResetPasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const openLoginDialog = useUiStore((state) => state.openLoginDialog)
  const resetPasswordMutation = useResetPasswordMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [missingToken, setMissingToken] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  useEffect(() => {
    const email = getPasswordResetEmail()

    if (email) {
      setValue('email', email)
    }

    setMissingToken(!getPasswordResetToken())
  }, [setValue])

  function handleBackToLogin() {
    openLoginDialog()
    navigate('/')
  }

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    const token = getPasswordResetToken()

    if (!token) {
      setMissingToken(true)
      setServerError(t('auth.missingResetToken'))
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: values.email,
        token,
        password: values.password,
      })

      clearPasswordResetFlow()
      handleBackToLogin()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      const emailError = fieldErrors?.email?.[0]
      const passwordError = fieldErrors?.password?.[0]
      const tokenError = fieldErrors?.token?.[0]

      if (emailError) {
        setError('email', { type: 'server', message: emailError })
      }

      if (passwordError) {
        setError('password', { type: 'server', message: passwordError })
      }

      setServerError(tokenError ?? getApiErrorMessage(error, t('auth.unableResetPassword')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="reset-password-email">{t('common.email')}</Label>
        <Input id="reset-password-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-new-password">{t('auth.newPassword')}</Label>
        <Input
          id="reset-password-new-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-confirmation">{t('auth.confirmPassword')}</Label>
        <Input
          id="reset-password-confirmation"
          type="password"
          autoComplete="new-password"
          {...register('password_confirmation')}
        />
        {errors.password_confirmation ? (
          <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
        ) : null}
      </div>

      {missingToken ? <p className="text-sm text-destructive">{t('auth.missingResetToken')}</p> : null}
      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={resetPasswordMutation.isPending || missingToken}>
        {resetPasswordMutation.isPending ? t('auth.resettingPassword') : t('auth.resetPasswordAction')}
      </Button>

      <Button className="w-full" type="button" variant="outline" onClick={handleBackToLogin}>
        {t('auth.backToLogin')}
      </Button>
    </form>
  )
}
