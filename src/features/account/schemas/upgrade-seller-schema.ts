import { z } from 'zod'

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed === '' ? undefined : trimmed
}

export interface UpgradeSellerFormValues {
  store_owner_name: string
  store_name: string
  address: string
  description?: string
  email?: string
  phone?: string
  logo?: FileList | null
  attachments?: FileList | null
}

export function createUpgradeSellerSchema(requireEmail: boolean, requirePhone: boolean) {
  return z
    .object({
      store_owner_name: z.string().min(1, 'Store owner name is required.').max(255, 'Must be 255 characters or fewer.'),
      store_name: z.string().min(1, 'Store name is required.').max(255, 'Must be 255 characters or fewer.'),
      address: z.string().min(1, 'Address is required.'),
      description: z.preprocess(emptyToUndefined, z.string().optional()),
      email: z.preprocess(emptyToUndefined, z.string().email('Enter a valid email address.').optional()),
      phone: z.preprocess(emptyToUndefined, z.string().optional()),
      logo: z.instanceof(FileList).nullable().optional(),
      attachments: z.instanceof(FileList).nullable().optional(),
    })
    .superRefine((values, context) => {
      if (requireEmail && !values.email) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required.',
          path: ['email'],
        })
      }

      if (requirePhone && !values.phone) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone is required.',
          path: ['phone'],
        })
      }
    }) as z.ZodType<UpgradeSellerFormValues>
}
