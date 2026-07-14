import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addTimeOff } from '@/features/provider-availability/api/provider-availability-api'
import type { AddTimeOffPayload } from '@/features/provider-availability/types/provider-availability.types'

export function useAddTimeOffMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddTimeOffPayload) => addTimeOff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-availability'] })
    },
  })
}
