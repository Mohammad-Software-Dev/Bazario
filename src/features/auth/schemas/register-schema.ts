import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(255, 'Name must be 255 characters or fewer.'),
  age: z
    .union([z.number().int().min(12, 'Age must be at least 12.').max(100, 'Age must be 100 or less.'), z.null()])
    .optional()
    .transform((value) => value ?? null),
  email: z.email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null))
    .pipe(z.union([z.string(), z.null()])),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export type RegisterSchemaInput = z.input<typeof registerSchema>
export type RegisterSchema = z.output<typeof registerSchema>
