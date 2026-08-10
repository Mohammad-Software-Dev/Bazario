import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPasswordMutation } from '@/features/auth/hooks/use-forgot-password-mutation'
import { setPasswordResetEmail } from '@/features/auth/lib/password-reset-storage'
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/forgot-password-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      await forgotPasswordMutation.mutateAsync(values)
      setPasswordResetEmail(values.email)
      navigate('/verify-reset-otp')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      const emailError = fieldErrors?.email?.[0]

      if (emailError) {
        setError('email', { type: 'server', message: emailError })
      }

      setServerError(getApiErrorMessage(error, t('auth.unableForgotPassword')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="forgot-password-email">{t('common.email')}</Label>
        <Input id="forgot-password-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={forgotPasswordMutation.isPending}>
        {forgotPasswordMutation.isPending ? t('auth.sendingResetOtp') : t('auth.sendResetOtp')}
      </Button>
    </form>
  )
}
