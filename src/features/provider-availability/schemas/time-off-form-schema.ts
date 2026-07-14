import { z } from 'zod'

export const timeOffFormSchema = z.object({
  starts_at: z.string().min(1, 'Start date and time are required.'),
  ends_at: z.string().min(1, 'End date and time are required.'),
  is_holiday: z.boolean(),
  reason: z.string().trim().max(255, 'Maximum 255 characters.'),
})

export type TimeOffFormValues = z.infer<typeof timeOffFormSchema>
