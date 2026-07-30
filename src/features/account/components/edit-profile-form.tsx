import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateProfileMutation } from '@/features/account/hooks/use-update-profile-mutation'
import { editProfileSchema, type EditProfileFormValues } from '@/features/account/schemas/edit-profile-schema'
import type { User } from '@/features/auth/types/auth.types'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'

interface EditProfileFormProps {
  user: User
}

function getAgeValidationError(value: string) {
  if (!value.trim()) {
    return null
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 12 || parsed > 100) {
    return 'Age must be a whole number between 12 and 100.'
  }

  return null
}

function normalizeAge(value: string): number | null {
  if (!value.trim()) {
    return null
  }

  return Number(value)
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const navigate = useNavigate()
  const updateProfileMutation = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      age: user.age ? String(user.age) : '',
    },
  })

  function onSubmit(values: EditProfileFormValues) {
    const ageError = getAgeValidationError(values.age)

    if (ageError) {
      setError('age', { type: 'validate', message: ageError })
      return
    }

    const normalizedAge = normalizeAge(values.age)

    updateProfileMutation.mutate(
      {
        name: values.name,
        email: values.email,
        phone: values.phone?.trim() ? values.phone.trim() : null,
        age: normalizedAge,
      },
      {
        onSuccess: () => {
          navigate('/account')
        },
        onError: (error) => {
          const fieldErrors = getApiFieldErrors(error)

          const nameError = fieldErrors?.name?.[0]
          const emailError = fieldErrors?.email?.[0]
          const phoneError = fieldErrors?.phone?.[0]
          const ageError = fieldErrors?.age?.[0]

          if (nameError) setError('name', { type: 'server', message: nameError })
          if (emailError) setError('email', { type: 'server', message: emailError })
          if (phoneError) setError('phone', { type: 'server', message: phoneError })
          if (ageError) setError('age', { type: 'server', message: ageError })
        },
      },
    )
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>Update the personal details shown on your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" {...register('name')} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" type="email" autoComplete="email" {...register('email')} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input id="profile-phone" autoComplete="tel" {...register('phone')} />
              {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2 md:max-w-40">
            <Label htmlFor="profile-age">Age</Label>
            <Input id="profile-age" inputMode="numeric" {...register('age')} />
            {errors.age ? <p className="text-sm text-destructive">{errors.age.message}</p> : null}
          </div>

          {updateProfileMutation.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(updateProfileMutation.error, 'Unable to update your profile right now.')}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/account')}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
