import { useMutation } from '@tanstack/react-query'

import { deleteAccount } from '@/features/auth/api/auth-api'
import type { DeleteAccountPayload } from '@/features/auth/types/auth.types'

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) => deleteAccount(payload),
  })
}
