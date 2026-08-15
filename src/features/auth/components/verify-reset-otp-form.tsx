import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { OtpCodeInput } from '@/features/auth/components/otp-code-input'
import { useVerifyResetOtpMutation } from '@/features/auth/hooks/use-verify-reset-otp-mutation'
import { getPasswordResetEmail, setPasswordResetToken } from '@/features/auth/lib/password-reset-storage'
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
  const [resetEmail, setResetEmail] = useState('')
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  useEffect(() => {
    const email = getPasswordResetEmail()

    if (email) {
      setResetEmail(email)
      return
    }

    navigate('/forgot-password', { replace: true })
  }, [navigate])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    if (!resetEmail) {
      navigate('/forgot-password', { replace: true })
      return
    }

    try {
      const response = await verifyResetOtpMutation.mutateAsync({
        email: resetEmail,
        otp: values.otp,
      })

      setPasswordResetToken(response.result.token)
      navigate('/reset-password')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      const otpError = fieldErrors?.otp?.[0]

      if (otpError) {
        setError('otp', { type: 'server', message: otpError })
      }

      setServerError(getApiErrorMessage(error, t('auth.unableVerifyResetOtp')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label>{t('auth.otpCode')}</Label>
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <OtpCodeInput
              value={field.value}
              disabled={verifyResetOtpMutation.isPending}
              onChange={(nextValue) => field.onChange(nextValue)}
            />
          )}
        />
        {errors.otp ? <p className="text-sm text-destructive">{errors.otp.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={verifyResetOtpMutation.isPending}>
        {verifyResetOtpMutation.isPending ? t('auth.verifyingResetOtp') : t('auth.verifyResetOtp')}
      </Button>
    </form>
  )
}
