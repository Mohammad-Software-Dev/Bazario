import { z } from 'zod'

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed === '' ? undefined : trimmed
}

export interface RegisterFormValues {
  name: string
  age: number | null
  email?: string
  phone?: string
  password: string
  password_confirmation: string
}

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required.').max(255, 'Name must be 255 characters or fewer.'),
    age: z.union([z.number().int().min(12, 'Age must be at least 12.').max(100, 'Age must be 100 or less.'), z.null()]),
    email: z.preprocess(emptyToUndefined, z.string().email('Enter a valid email address.').optional()),
    phone: z.preprocess(emptyToUndefined, z.string().optional()),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    password_confirmation: z.string().min(6, 'Password confirmation is required.'),
  })
  .superRefine((values, context) => {
    if (!values.email && !values.phone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter either an email or a phone number.',
        path: ['email'],
      })
    }

    if (values.password !== values.password_confirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: ['password_confirmation'],
      })
    }
  }) as z.ZodType<RegisterFormValues>

export type RegisterSchema = RegisterFormValues
