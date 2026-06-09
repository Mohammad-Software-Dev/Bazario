import { useMutation } from '@tanstack/react-query'

import { register } from '@/features/auth/api/auth-api'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  })
}
