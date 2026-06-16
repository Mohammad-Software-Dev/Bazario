import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpgradeServiceProviderMutation } from '@/features/account/hooks/use-upgrade-service-provider-mutation'
import {
  createUpgradeServiceProviderSchema,
  type UpgradeServiceProviderFormValues,
} from '@/features/account/schemas/upgrade-service-provider-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

export function ServiceProviderUpgradeForm() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const mutation = useUpgradeServiceProviderMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const currentUser = session?.user
  const schema = createUpgradeServiceProviderSchema(!currentUser?.email, !currentUser?.phone)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpgradeServiceProviderFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      name: currentUser?.name ?? '',
      address: '',
      description: '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      logo: null,
      attachments: null,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(values)
      navigate('/account')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)

      if (fieldErrors?.name?.[0]) setError('name', { type: 'server', message: fieldErrors.name[0] })
      if (fieldErrors?.address?.[0]) setError('address', { type: 'server', message: fieldErrors.address[0] })
      if (fieldErrors?.description?.[0]) setError('description', { type: 'server', message: fieldErrors.description[0] })
      if (fieldErrors?.email?.[0]) setError('email', { type: 'server', message: fieldErrors.email[0] })
      if (fieldErrors?.phone?.[0]) setError('phone', { type: 'server', message: fieldErrors.phone[0] })
      if (fieldErrors?.logo?.[0]) setError('logo', { type: 'server', message: fieldErrors.logo[0] })
      if (fieldErrors?.attachments?.[0]) setError('attachments', { type: 'server', message: fieldErrors.attachments[0] })

      setServerError(getApiErrorMessage(error, 'Unable to submit service provider upgrade right now.'))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="provider-name">Name</Label>
        <Input id="provider-name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-address">Address</Label>
        <Input id="provider-address" {...register('address')} />
        {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-description">Description</Label>
        <Textarea id="provider-description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="provider-email">Email</Label>
          <Input
            id="provider-email"
            type="email"
            {...register('email', {
              setValueAs: (value: string) => (value.trim() === '' ? undefined : value.trim()),
            })}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider-phone">Phone</Label>
          <Input
            id="provider-phone"
            type="tel"
            {...register('phone', {
              setValueAs: (value: string) => (value.trim() === '' ? undefined : value.trim()),
            })}
          />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-logo">Logo</Label>
        <Input id="provider-logo" type="file" accept="image/*" {...register('logo')} />
        {errors.logo ? <p className="text-sm text-destructive">{errors.logo.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider-attachments">Attachments</Label>
        <Input id="provider-attachments" type="file" multiple accept=".pdf,image/*" {...register('attachments')} />
        {errors.attachments ? <p className="text-sm text-destructive">{errors.attachments.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit provider application'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/account')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
