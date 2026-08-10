import { useMutation } from '@tanstack/react-query'

import { verifyResetOtp } from '@/features/auth/api/auth-api'

export function useVerifyResetOtpMutation() {
  return useMutation({
    mutationFn: verifyResetOtp,
  })
}
