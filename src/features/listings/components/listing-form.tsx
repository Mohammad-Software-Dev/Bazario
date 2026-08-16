import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { listingFormSchema, type ListingFormValues } from '@/features/listings/schemas/listing-form-schema'
import type { CreateListingPayload } from '@/features/listings/types/listing.types'

interface ListingFormProps {
  isSubmitting: boolean
  onSubmit: (payload: CreateListingPayload) => Promise<void> | void
}

export function ListingForm({ isSubmitting, onSubmit }: ListingFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const submit = handleSubmit(async (values) => {
    const images = values.images as FileList | null | undefined

    if (!images?.length) {
      return
    }

    await onSubmit({
      title: values.title,
      description: values.description || undefined,
      images,
    })
  })

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="listing-title">{t('listings.form.title')}</Label>
        <Input id="listing-title" {...register('title')} />
        {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="listing-description">{t('listings.form.description')}</Label>
        <Textarea id="listing-description" rows={5} {...register('description')} />
        {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="listing-images">{t('listings.form.images')}</Label>
        <Input id="listing-images" type="file" accept="image/*" multiple {...register('images')} />
        <p className="text-xs text-muted-foreground">{t('listings.form.imagesHint')}</p>
        {errors.images ? <p className="text-sm text-destructive">{errors.images.message}</p> : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('listings.creating') : t('listings.create')}
      </Button>
    </form>
  )
}
