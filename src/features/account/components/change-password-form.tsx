import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdatePasswordMutation } from '@/features/account/hooks/use-update-password-mutation'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/features/account/schemas/change-password-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const updatePasswordMutation = useUpdatePasswordMutation()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  function onSubmit(values: ChangePasswordFormValues) {
    updatePasswordMutation.mutate(
      {
        old_password: values.old_password,
        password: values.password,
      },
      {
        onSuccess: () => {
          reset()
        },
        onError: (error) => {
          const fieldErrors = getApiFieldErrors(error)
          const oldPasswordError = fieldErrors?.old_password?.[0]
          const passwordError = fieldErrors?.password?.[0]

          if (oldPasswordError) {
            setError('old_password', { type: 'server', message: oldPasswordError })
          }

          if (passwordError) {
            setError('password', { type: 'server', message: passwordError })
          }
        },
      },
    )
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>{t('password.title')}</CardTitle>
        <CardDescription>{t('password.formDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="old-password">{t('password.current')}</Label>
            <Input id="old-password" type="password" autoComplete="current-password" {...register('old_password')} />
            {errors.old_password ? <p className="text-sm text-destructive">{errors.old_password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{t('password.new')}</Label>
            <Input id="new-password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password-confirmation">{t('password.confirm')}</Label>
            <Input
              id="new-password-confirmation"
              type="password"
              autoComplete="new-password"
              {...register('password_confirmation')}
            />
            {errors.password_confirmation ? (
              <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
            ) : null}
          </div>

          {updatePasswordMutation.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(updatePasswordMutation.error, t('password.updateError'))}
            </p>
          ) : null}

          {updatePasswordMutation.isSuccess ? (
            <p className="text-sm text-primary">{t('password.updated')}</p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={updatePasswordMutation.isPending}>
              {updatePasswordMutation.isPending ? t('common.saving') : t('password.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
