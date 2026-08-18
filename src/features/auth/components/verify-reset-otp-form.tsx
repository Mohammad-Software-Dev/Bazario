import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { OtpCodeInput } from '@/features/auth/components/otp-code-input'
import { useForgotPasswordMutation } from '@/features/auth/hooks/use-forgot-password-mutation'
import { useVerifyResetOtpMutation } from '@/features/auth/hooks/use-verify-reset-otp-mutation'
import { getPasswordResetEmail, setPasswordResetToken } from '@/features/auth/lib/password-reset-storage'
import {
  verifyResetOtpSchema,
  type VerifyResetOtpFormValues,
} from '@/features/auth/schemas/verify-reset-otp-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'

const RESEND_COOLDOWN_SECONDS = 120

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function VerifyResetOtpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const verifyResetOtpMutation = useVerifyResetOtpMutation()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resetEmail, setResetEmail] = useState('')
  const [secondsUntilResend, setSecondsUntilResend] = useState(0)
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

  useEffect(() => {
    if (secondsUntilResend <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setSecondsUntilResend((currentSeconds) =>
        currentSeconds > 0 ? currentSeconds - 1 : 0,
      )
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [secondsUntilResend])

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

  async function handleResendCode() {
    if (!resetEmail || secondsUntilResend > 0) {
      return
    }

    setResendError(null)

    try {
      await forgotPasswordMutation.mutateAsync({ email: resetEmail })
      setSecondsUntilResend(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      setResendError(getApiErrorMessage(error, t('auth.unableForgotPassword')))
    }
  }

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
      {resendError ? <p className="text-sm text-destructive">{resendError}</p> : null}

      <div className="text-center">
        {secondsUntilResend > 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('auth.resendCodeCountdown', {
              time: formatCountdown(secondsUntilResend),
            })}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendCode}
            disabled={forgotPasswordMutation.isPending || !resetEmail}
            className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {forgotPasswordMutation.isPending ? t('auth.resendingCode') : t('auth.resendCode')}
          </button>
        )}
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={verifyResetOtpMutation.isPending || forgotPasswordMutation.isPending}
      >
        {verifyResetOtpMutation.isPending ? t('auth.verifyingResetOtp') : t('auth.verifyResetOtp')}
      </Button>
    </form>
  )
}
