import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVerifyResetOtpMutation } from '@/features/auth/hooks/use-verify-reset-otp-mutation'
import {
  getPasswordResetEmail,
  setPasswordResetEmail,
  setPasswordResetToken,
} from '@/features/auth/lib/password-reset-storage'
import {
  verifyResetOtpSchema,
  type VerifyResetOtpFormValues,
} from '@/features/auth/schemas/verify-reset-otp-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'

export function VerifyResetOtpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const verifyResetOtpMutation = useVerifyResetOtpMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),
    defaultValues: {
      email: '',
      otp: '',
    },
  })

  useEffect(() => {
    const email = getPasswordResetEmail()

    if (email) {
      setValue('email', email)
    }
  }, [setValue])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      const response = await verifyResetOtpMutation.mutateAsync(values)

      setPasswordResetEmail(values.email)
      setPasswordResetToken(response.result.token)

      navigate('/reset-password')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      const emailError = fieldErrors?.email?.[0]
      const otpError = fieldErrors?.otp?.[0]

      if (emailError) {
        setError('email', { type: 'server', message: emailError })
      }

      if (otpError) {
        setError('otp', { type: 'server', message: otpError })
      }

      setServerError(getApiErrorMessage(error, t('auth.unableVerifyResetOtp')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="verify-reset-email">{t('common.email')}</Label>
        <Input id="verify-reset-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="verify-reset-otp">{t('auth.otpCode')}</Label>
        <Input id="verify-reset-otp" inputMode="numeric" autoComplete="one-time-code" {...register('otp')} />
        {errors.otp ? <p className="text-sm text-destructive">{errors.otp.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={verifyResetOtpMutation.isPending}>
        {verifyResetOtpMutation.isPending ? t('auth.verifyingResetOtp') : t('auth.verifyResetOtp')}
      </Button>
    </form>
  )
}
