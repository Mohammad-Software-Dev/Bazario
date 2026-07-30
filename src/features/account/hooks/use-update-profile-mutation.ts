import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile } from '@/features/account/api/account-api'
import type { UpdateProfilePayload } from '@/features/account/types/account.types'
import { useAuthStore } from '@/stores/auth-store'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (result) => {
      useAuthStore.getState().syncVerifiedUser(result.user)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
