import { z } from 'zod'

export const verifyResetOtpSchema = z.object({
  otp: z
    .string()
    .min(1, 'Verification code is required.')
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
})

export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>
