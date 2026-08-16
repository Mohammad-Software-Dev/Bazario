import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
    return 'age'
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const updateProfileMutation = useUpdateProfileMutation()
  const sellerProfile = user.seller_profile ?? null
  const serviceProviderProfile = user.service_provider_profile ?? null
  const sellerLogo = sellerProfile?.logo_url ?? sellerProfile?.logo ?? null
  const serviceProviderLogo = serviceProviderProfile?.logo_url ?? serviceProviderProfile?.logo ?? null

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
      setError('age', { type: 'validate', message: t('profile.ageValidation') })
      return
    }

    const normalizedAge = normalizeAge(values.age)

    updateProfileMutation.mutate(
      {
        name: values.name,
        email: values.email,
        phone: values.phone?.trim() ? values.phone.trim() : null,
        age: normalizedAge,
        seller_logo: (values.seller_logo as FileList | null | undefined) ?? null,
        service_provider_logo: (values.service_provider_logo as FileList | null | undefined) ?? null,
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
          const sellerLogoError = fieldErrors?.seller_logo?.[0]
          const serviceProviderLogoError = fieldErrors?.service_provider_logo?.[0]

          if (nameError) setError('name', { type: 'server', message: nameError })
          if (emailError) setError('email', { type: 'server', message: emailError })
          if (phoneError) setError('phone', { type: 'server', message: phoneError })
          if (ageError) setError('age', { type: 'server', message: ageError })
          if (sellerLogoError) setError('seller_logo', { type: 'server', message: sellerLogoError })
          if (serviceProviderLogoError) {
            setError('service_provider_logo', { type: 'server', message: serviceProviderLogoError })
          }
        },
      },
    )
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>{t('profile.formTitle')}</CardTitle>
        <CardDescription>{t('profile.formDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="profile-name">{t('common.name')}</Label>
            <Input id="profile-name" {...register('name')} />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-email">{t('common.email')}</Label>
              <Input id="profile-email" type="email" autoComplete="email" {...register('email')} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">{t('auth.phone')}</Label>
              <Input id="profile-phone" autoComplete="tel" {...register('phone')} />
              {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2 md:max-w-40">
            <Label htmlFor="profile-age">{t('auth.age')}</Label>
            <Input id="profile-age" inputMode="numeric" {...register('age')} />
            {errors.age ? <p className="text-sm text-destructive">{errors.age.message}</p> : null}
          </div>

          {sellerProfile ? (
            <div className="space-y-3 rounded-xl border border-border/70 p-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t('profile.sellerLogoTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('profile.logoDescription')}</p>
              </div>
              {sellerLogo ? (
                <img
                  src={sellerLogo}
                  alt={t('sellerProfile.logoAlt')}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 rounded-xl border border-border/70 object-cover"
                />
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="profile-seller-logo">{t('upgradeForm.logo')}</Label>
                <Input id="profile-seller-logo" type="file" accept="image/*" {...register('seller_logo')} />
                {errors.seller_logo ? (
                  <p className="text-sm text-destructive">{String(errors.seller_logo.message)}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {serviceProviderProfile ? (
            <div className="space-y-3 rounded-xl border border-border/70 p-4">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t('profile.providerLogoTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('profile.logoDescription')}</p>
              </div>
              {serviceProviderLogo ? (
                <img
                  src={serviceProviderLogo}
                  alt={t('providerProfile.logoAlt')}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 rounded-xl border border-border/70 object-cover"
                />
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="profile-provider-logo">{t('upgradeForm.logo')}</Label>
                <Input
                  id="profile-provider-logo"
                  type="file"
                  accept="image/*"
                  {...register('service_provider_logo')}
                />
                {errors.service_provider_logo ? (
                  <p className="text-sm text-destructive">{String(errors.service_provider_logo.message)}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {updateProfileMutation.isError ? (
            <p className="text-sm text-destructive">
              {getApiErrorMessage(updateProfileMutation.error, t('profile.updateProfileError'))}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/account')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? t('bookings.saving') : t('profile.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
