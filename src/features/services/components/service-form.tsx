import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { serviceFormSchema, type ServiceFormValues } from '@/features/services/schemas/service-form-schema'
import type { ServiceCategory, ServiceListItem } from '@/features/services/types/service.types'
import { getLocalizedValue } from '@/lib/localized-value'

interface ServiceFormProps {
  categories: ServiceCategory[]
  initialService?: ServiceListItem
  isCategoriesLoading?: boolean
  isSubmitting: boolean
  mode: 'create' | 'edit'
  onSubmit: (values: ServiceFormValues) => void
}

function toNumberOrNull(value: string) {
  if (value === '') {
    return null
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function ServiceForm({
  categories,
  initialService,
  isCategoriesLoading = false,
  isSubmitting,
  mode,
  onSubmit,
}: ServiceFormProps) {
  const titleTranslations = initialService?.title_translations
  const descriptionTranslations = initialService?.description_translations

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: {
        en: titleTranslations?.en ?? (typeof initialService?.title === 'string' ? initialService.title : ''),
        ar: titleTranslations?.ar ?? '',
      },
      description: {
        en: descriptionTranslations?.en ?? '',
        ar: descriptionTranslations?.ar ?? '',
      },
      category_id: initialService?.category_id ?? 0,
      price: initialService?.price ?? 0,
      duration_minutes: initialService?.duration_minutes ?? 60,
      location_type: initialService?.location_type ?? '',
      is_active: initialService?.is_active ?? true,
      max_concurrent_bookings: initialService?.max_concurrent_bookings ?? 1,
      slot_interval_minutes: initialService?.slot_interval_minutes ?? 15,
      cancel_cutoff_hours: initialService?.cancel_cutoff_hours ?? 0,
      edit_cutoff_hours: initialService?.edit_cutoff_hours ?? 0,
      cancel_late_policy: initialService?.cancel_late_policy ?? 'deny',
      edit_late_policy: initialService?.edit_late_policy ?? 'deny',
      images: null,
    },
  })

  useEffect(() => {
    reset({
      title: {
        en: titleTranslations?.en ?? (typeof initialService?.title === 'string' ? initialService.title : ''),
        ar: titleTranslations?.ar ?? '',
      },
      description: {
        en: descriptionTranslations?.en ?? '',
        ar: descriptionTranslations?.ar ?? '',
      },
      category_id: initialService?.category_id ?? 0,
      price: initialService?.price ?? 0,
      duration_minutes: initialService?.duration_minutes ?? 60,
      location_type: initialService?.location_type ?? '',
      is_active: initialService?.is_active ?? true,
      max_concurrent_bookings: initialService?.max_concurrent_bookings ?? 1,
      slot_interval_minutes: initialService?.slot_interval_minutes ?? 15,
      cancel_cutoff_hours: initialService?.cancel_cutoff_hours ?? 0,
      edit_cutoff_hours: initialService?.edit_cutoff_hours ?? 0,
      cancel_late_policy: initialService?.cancel_late_policy ?? 'deny',
      edit_late_policy: initialService?.edit_late_policy ?? 'deny',
      images: null,
    })
  }, [descriptionTranslations?.ar, descriptionTranslations?.en, initialService, reset, titleTranslations?.ar, titleTranslations?.en])

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service-title-en">Title (English)</Label>
          <Input id="service-title-en" {...register('title.en')} />
          {errors.title?.en ? <p className="text-sm text-destructive">{errors.title.en.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-title-ar">Title (Arabic)</Label>
          <Input id="service-title-ar" {...register('title.ar')} />
          {errors.title?.ar ? <p className="text-sm text-destructive">{errors.title.ar.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service-description-en">Description (English)</Label>
          <Textarea id="service-description-en" rows={4} {...register('description.en')} />
          {errors.description?.en ? <p className="text-sm text-destructive">{errors.description.en.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-description-ar">Description (Arabic)</Label>
          <Textarea id="service-description-ar" rows={4} {...register('description.ar')} />
          {errors.description?.ar ? <p className="text-sm text-destructive">{errors.description.ar.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service-category">Category</Label>
          <select
            id="service-category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('category_id', { setValueAs: (value) => Number(value) })}
            disabled={isCategoriesLoading}
          >
            <option value={0}>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {getLocalizedValue(category.name) || `Category #${category.id}`}
              </option>
            ))}
          </select>
          {errors.category_id ? <p className="text-sm text-destructive">{errors.category_id.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-price">Price</Label>
          <Input
            id="service-price"
            type="number"
            step="0.01"
            {...register('price', { setValueAs: (value) => Number(value) })}
          />
          {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="service-duration">Duration (minutes)</Label>
          <Input
            id="service-duration"
            type="number"
            {...register('duration_minutes', { setValueAs: toNumberOrNull })}
          />
          {errors.duration_minutes ? <p className="text-sm text-destructive">{errors.duration_minutes.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-slot-interval">Slot interval (minutes)</Label>
          <Input
            id="service-slot-interval"
            type="number"
            {...register('slot_interval_minutes', { setValueAs: toNumberOrNull })}
          />
          {errors.slot_interval_minutes ? <p className="text-sm text-destructive">{errors.slot_interval_minutes.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-capacity">Max concurrent bookings</Label>
          <Input
            id="service-capacity"
            type="number"
            {...register('max_concurrent_bookings', { setValueAs: toNumberOrNull })}
          />
          {errors.max_concurrent_bookings ? <p className="text-sm text-destructive">{errors.max_concurrent_bookings.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-location-type">Location type</Label>
          <Input id="service-location-type" {...register('location_type')} />
          {errors.location_type ? <p className="text-sm text-destructive">{errors.location_type.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="service-cancel-cutoff">Cancel cutoff (hours)</Label>
          <Input
            id="service-cancel-cutoff"
            type="number"
            {...register('cancel_cutoff_hours', { setValueAs: toNumberOrNull })}
          />
          {errors.cancel_cutoff_hours ? <p className="text-sm text-destructive">{errors.cancel_cutoff_hours.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-edit-cutoff">Edit cutoff (hours)</Label>
          <Input
            id="service-edit-cutoff"
            type="number"
            {...register('edit_cutoff_hours', { setValueAs: toNumberOrNull })}
          />
          {errors.edit_cutoff_hours ? <p className="text-sm text-destructive">{errors.edit_cutoff_hours.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-cancel-policy">Late cancel policy</Label>
          <select
            id="service-cancel-policy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('cancel_late_policy')}
          >
            <option value="">Not set</option>
            <option value="deny">Deny</option>
            <option value="allow">Allow</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-edit-policy">Late edit policy</Label>
          <select
            id="service-edit-policy"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('edit_late_policy')}
          >
            <option value="">Not set</option>
            <option value="deny">Deny</option>
            <option value="allow">Allow</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <input id="service-active" type="checkbox" className="h-4 w-4" {...register('is_active')} />
          <Label htmlFor="service-active">Service is active and bookable</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-images">Images</Label>
          <Input id="service-images" type="file" accept="image/*" multiple {...register('images')} />
          <p className="text-xs text-muted-foreground">
            {mode === 'edit'
              ? 'Uploading new images will replace the current service images.'
              : 'You can upload up to 5 service images.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting || isCategoriesLoading}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create service' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
