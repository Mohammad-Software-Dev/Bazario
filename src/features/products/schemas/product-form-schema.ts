import { z } from 'zod'

const localizedTextSchema = z.object({
  en: z.string().trim().min(1, 'English value is required.').max(255, 'Maximum 255 characters.'),
  ar: z.string().trim().min(1, 'Arabic value is required.').max(255, 'Maximum 255 characters.'),
})

const optionalLocalizedTextSchema = z.object({
  en: z.string().trim().max(5000, 'Maximum 5000 characters.'),
  ar: z.string().trim().max(5000, 'Maximum 5000 characters.'),
})

export const productFormSchema = z.object({
  name: localizedTextSchema,
  description: optionalLocalizedTextSchema,
  category_id: z.number().int().positive('Category is required.'),
  price: z.number().min(0, 'Price must be zero or greater.'),
  images: z.custom<FileList | null | undefined>(() => true).optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
