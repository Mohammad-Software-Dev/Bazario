import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required.'),
    password: z.string().min(6, 'New password must be at least 6 characters.'),
    password_confirmation: z.string().min(6, 'Please confirm your new password.'),
  })
  .superRefine((values, context) => {
    if (values.password !== values.password_confirmation) {
      context.addIssue({
        code: 'custom',
        path: ['password_confirmation'],
        message: 'Password confirmation must match the new password.',
      })
    }
  })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
