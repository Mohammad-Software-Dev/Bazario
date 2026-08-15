import { z } from 'zod'

export const verifyResetOtpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP is required.')
    .regex(/^\d{6}$/, 'Enter the 6-digit OTP code.'),
})

export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>
