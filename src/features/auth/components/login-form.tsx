import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/features/auth/hooks/use-login-mutation'
import { loginSchema, type LoginSchema } from '@/features/auth/schemas/login-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const navigate = useNavigate()
  const { setSession } = useAuth()
  const loginMutation = useLoginMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      const response = await loginMutation.mutateAsync(values)

      setSession({
        token: response.result.token,
        user: response.result.user,
        roles: response.result.roles,
      })

      onSuccess?.()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)

      const emailError = fieldErrors?.email?.[0]
      const passwordError = fieldErrors?.password?.[0]

      if (emailError) {
        setError('email', { type: 'server', message: emailError })
      }

      if (passwordError) {
        setError('password', { type: 'server', message: passwordError })
      }

      setServerError(getApiErrorMessage(error, 'Unable to log in right now.'))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input id="login-password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive">{serverError}</p>
      ) : null}

      <Button
        className="w-full"
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Signing in...' : 'Login'}
      </Button>

      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account yet?{' '}
        <button
          className="font-medium text-foreground underline underline-offset-4"
          type="button"
          onClick={() => {
            onSuccess?.()
            navigate('/register')
          }}
        >
          Register
        </button>
      </p>
    </form>
  )
}
