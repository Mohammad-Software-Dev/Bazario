import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterMutation } from '@/features/auth/hooks/use-register-mutation'
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/register-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

export function RegisterForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const registerMutation = useRegisterMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as never),
    defaultValues: {
      name: '',
      age: null,
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      const response = await registerMutation.mutateAsync(values)

      setSession({
        token: response.result.token,
        user: response.result.user,
        roles: response.result.roles,
      })

      navigate('/')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      const nameError = fieldErrors?.name?.[0]
      const ageError = fieldErrors?.age?.[0]
      const emailError = fieldErrors?.email?.[0]
      const phoneError = fieldErrors?.phone?.[0]
      const passwordError = fieldErrors?.password?.[0]
      const passwordConfirmationError = fieldErrors?.password_confirmation?.[0]

      if (nameError) setError('name', { type: 'server', message: nameError })
      if (ageError) setError('age', { type: 'server', message: ageError })
      if (emailError) setError('email', { type: 'server', message: emailError })
      if (phoneError) setError('phone', { type: 'server', message: phoneError })
      if (passwordError) setError('password', { type: 'server', message: passwordError })
      if (passwordConfirmationError) {
        setError('password_confirmation', { type: 'server', message: passwordConfirmationError })
      }

      setServerError(getApiErrorMessage(error, t('auth.unableRegister')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="register-name">{t('common.name')}</Label>
        <Input id="register-name" autoComplete="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-age">{t('auth.age')}</Label>
        <Input
          id="register-age"
          type="number"
          inputMode="numeric"
          {...register('age', {
            setValueAs: (value: string) => (value === '' ? null : Number(value)),
          })}
        />
        {errors.age ? <p className="text-sm text-destructive">{errors.age.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">{t('common.email')}</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          {...register('email', {
            setValueAs: (value: string) => value.trim(),
          })}
        />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">{t('auth.phone')}</Label>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          {...register('phone', {
            setValueAs: (value: string) => (value.trim() === '' ? undefined : value.trim()),
          })}
        />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">{t('auth.password')}</Label>
        <Input id="register-password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password-confirmation">{t('auth.confirmPassword')}</Label>
        <Input
          id="register-password-confirmation"
          type="password"
          autoComplete="new-password"
          {...register('password_confirmation')}
        />
        {errors.password_confirmation ? (
          <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
        ) : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? t('auth.creatingAccount') : t('auth.createAccount')}
      </Button>
    </form>
  )
}
