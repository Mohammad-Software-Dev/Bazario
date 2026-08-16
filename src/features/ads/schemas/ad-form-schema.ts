import { z } from 'zod'

function isFileListLike(value: unknown): value is { length: number } {
  return typeof value === 'object' && value !== null && 'length' in value
}

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
    duration_days: z.number().int().min(1, 'Please choose a duration.').max(7, 'Maximum 7 days.'),
    images: z
      .custom<FileList | null | undefined>((value) => value == null || isFileListLike(value))
      .refine((value) => Boolean(value?.length), 'Please upload at least one image.'),
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
