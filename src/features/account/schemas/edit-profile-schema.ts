import { z } from 'zod'

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(255, 'Name must be 255 characters or fewer.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().optional(),
  age: z.string(),
  seller_logo: z.any().optional(),
  service_provider_logo: z.any().optional(),
})

export type EditProfileFormValues = z.infer<typeof editProfileSchema>
