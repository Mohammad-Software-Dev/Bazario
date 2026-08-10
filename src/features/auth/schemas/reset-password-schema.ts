import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    password_confirmation: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
