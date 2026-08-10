import { z } from 'zod'

export const listingFormSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  price: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), 'Price must be a number.'),
  attributes: z.string().trim().optional().or(z.literal('')),
  images: z.any().optional(),
})

export type ListingFormValues = z.infer<typeof listingFormSchema>
