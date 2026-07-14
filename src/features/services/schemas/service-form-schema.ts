import { z } from 'zod'

const localizedTextSchema = z.object({
  en: z.string().trim().min(1, 'English value is required.').max(255, 'Maximum 255 characters.'),
  ar: z.string().trim().min(1, 'Arabic value is required.').max(255, 'Maximum 255 characters.'),
})

const optionalLocalizedTextSchema = z.object({
  en: z.string().trim().max(5000, 'Maximum 5000 characters.'),
  ar: z.string().trim().max(5000, 'Maximum 5000 characters.'),
})

export const serviceFormSchema = z.object({
  title: localizedTextSchema,
  description: optionalLocalizedTextSchema,
  category_id: z.number().int().positive('Category is required.'),
  price: z.number().min(0, 'Price must be zero or greater.'),
  duration_minutes: z.number().int().min(5, 'Minimum 5 minutes.').nullable(),
  location_type: z.string().trim().max(32, 'Maximum 32 characters.'),
  is_active: z.boolean(),
  max_concurrent_bookings: z.number().int().min(1, 'Minimum 1 booking.').nullable(),
  slot_interval_minutes: z.number().int().min(5, 'Minimum 5 minutes.').nullable(),
  cancel_cutoff_hours: z.number().int().min(0, 'Minimum 0 hours.').nullable(),
  edit_cutoff_hours: z.number().int().min(0, 'Minimum 0 hours.').nullable(),
  cancel_late_policy: z.union([z.literal('deny'), z.literal('allow'), z.literal('')]),
  edit_late_policy: z.union([z.literal('deny'), z.literal('allow'), z.literal('')]),
  images: z.custom<FileList | null | undefined>(() => true).optional(),
})

export type ServiceFormValues = z.infer<typeof serviceFormSchema>
