import { z } from 'zod'

function isFileListLike(value: unknown): value is { length: number } {
  return typeof value === 'object' && value !== null && 'length' in value
}

export const listingFormSchema = z.object({
  title: z.string().trim().min(3).max(255),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  images: z
    .custom<FileList | null | undefined>((value) => value == null || isFileListLike(value))
    .refine((value) => Boolean(value?.length), 'Please upload at least one image.'),
})

export type ListingFormValues = z.infer<typeof listingFormSchema>
