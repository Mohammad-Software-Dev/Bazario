import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUpgradeSellerMutation } from '@/features/account/hooks/use-upgrade-seller-mutation'
import {
  createUpgradeSellerSchema,
  type UpgradeSellerFormValues,
} from '@/features/account/schemas/upgrade-seller-schema'
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

export function SellerUpgradeForm() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const mutation = useUpgradeSellerMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const currentUser = session?.user
  const schema = createUpgradeSellerSchema(!currentUser?.email, !currentUser?.phone)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UpgradeSellerFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      store_owner_name: currentUser?.name ?? '',
      store_name: '',
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

      if (fieldErrors?.store_owner_name?.[0]) setError('store_owner_name', { type: 'server', message: fieldErrors.store_owner_name[0] })
      if (fieldErrors?.store_name?.[0]) setError('store_name', { type: 'server', message: fieldErrors.store_name[0] })
      if (fieldErrors?.address?.[0]) setError('address', { type: 'server', message: fieldErrors.address[0] })
      if (fieldErrors?.description?.[0]) setError('description', { type: 'server', message: fieldErrors.description[0] })
      if (fieldErrors?.email?.[0]) setError('email', { type: 'server', message: fieldErrors.email[0] })
      if (fieldErrors?.phone?.[0]) setError('phone', { type: 'server', message: fieldErrors.phone[0] })
      if (fieldErrors?.logo?.[0]) setError('logo', { type: 'server', message: fieldErrors.logo[0] })
      if (fieldErrors?.attachments?.[0]) setError('attachments', { type: 'server', message: fieldErrors.attachments[0] })

      setServerError(getApiErrorMessage(error, 'Unable to submit seller upgrade right now.'))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seller-store-owner-name">Store owner name</Label>
          <Input id="seller-store-owner-name" {...register('store_owner_name')} />
          {errors.store_owner_name ? <p className="text-sm text-destructive">{errors.store_owner_name.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seller-store-name">Store name</Label>
          <Input id="seller-store-name" {...register('store_name')} />
          {errors.store_name ? <p className="text-sm text-destructive">{errors.store_name.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seller-address">Address</Label>
        <Input id="seller-address" {...register('address')} />
        {errors.address ? <p className="text-sm text-destructive">{errors.address.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="seller-description">Description</Label>
        <Textarea id="seller-description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="seller-email">Email</Label>
          <Input
            id="seller-email"
            type="email"
            {...register('email', {
              setValueAs: (value: string) => (value.trim() === '' ? undefined : value.trim()),
            })}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seller-phone">Phone</Label>
          <Input
            id="seller-phone"
            type="tel"
            {...register('phone', {
              setValueAs: (value: string) => (value.trim() === '' ? undefined : value.trim()),
            })}
          />
          {errors.phone ? <p className="text-sm text-destructive">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seller-logo">Logo</Label>
        <Input id="seller-logo" type="file" accept="image/*" {...register('logo')} />
        {errors.logo ? <p className="text-sm text-destructive">{errors.logo.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="seller-attachments">Attachments</Label>
        <Input id="seller-attachments" type="file" multiple accept=".pdf,image/*" {...register('attachments')} />
        {errors.attachments ? <p className="text-sm text-destructive">{errors.attachments.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit seller application'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/account')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
