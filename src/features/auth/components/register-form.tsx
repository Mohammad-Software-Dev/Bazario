import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterMutation } from '@/features/auth/hooks/use-register-mutation'
import {
  registerSchema,
  type RegisterSchema,
  type RegisterSchemaInput,
} from '@/features/auth/schemas/register-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const registerMutation = useRegisterMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchemaInput, undefined, RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      phone: '',
      password: '',
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

      if (nameError) setError('name', { type: 'server', message: nameError })
      if (ageError) setError('age', { type: 'server', message: ageError })
      if (emailError) setError('email', { type: 'server', message: emailError })
      if (phoneError) setError('phone', { type: 'server', message: phoneError })
      if (passwordError) setError('password', { type: 'server', message: passwordError })

      setServerError(getApiErrorMessage(error, 'Unable to create your account right now.'))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="register-name">Name</Label>
        <Input id="register-name" autoComplete="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-age">Age</Label>
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
        <Label htmlFor="register-email">Email</Label>
        <Input id="register-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">Phone</Label>
        <Input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          {...register('phone', {
            setValueAs: (value: string) => (value === '' ? null : value),
          })}
        />
        {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input id="register-password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  )
}
