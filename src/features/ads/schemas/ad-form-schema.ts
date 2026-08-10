import { z } from 'zod'

export const adFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(255, 'Maximum 255 characters.'),
    subtitle: z.string().trim().max(255, 'Maximum 255 characters.').optional().or(z.literal('')),
    tier: z.union([z.literal('gold'), z.literal('silver'), z.literal('normal')]),
    adable_type: z.union([
      z.literal('product'),
      z.literal('service'),
      z.literal('seller'),
      z.literal('service_provider'),
    ]),
    adable_id: z.number().int().positive().nullable(),
    expires_at: z.string().optional().or(z.literal('')),
    images: z.custom<FileList | null | undefined>(() => true).optional(),
  })
  .superRefine((values, ctx) => {
    if ((values.adable_type === 'product' || values.adable_type === 'service') && !values.adable_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['adable_id'],
        message: 'Please select what to promote.',
      })
    }
  })

export type AdFormValues = z.infer<typeof adFormSchema>
