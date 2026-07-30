import { useMutation } from '@tanstack/react-query'

import { updatePassword } from '@/features/auth/api/auth-api'
import type { UpdatePasswordPayload } from '@/features/auth/types/auth.types'

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => updatePassword(payload),
  })
}
