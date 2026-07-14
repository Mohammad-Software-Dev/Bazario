import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateWorkingHours } from '@/features/provider-availability/api/provider-availability-api'
import type { UpdateWorkingHoursPayload } from '@/features/provider-availability/types/provider-availability.types'

export function useUpdateWorkingHoursMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateWorkingHoursPayload) => updateWorkingHours(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-availability'] })
    },
  })
}
