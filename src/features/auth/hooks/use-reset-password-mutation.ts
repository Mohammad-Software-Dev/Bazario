import { useMutation } from '@tanstack/react-query'

import { resetPassword } from '@/features/auth/api/auth-api'

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPassword,
  })
}
