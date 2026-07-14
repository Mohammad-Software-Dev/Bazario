import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTimeOff } from '@/features/provider-availability/api/provider-availability-api'

export function useDeleteTimeOffMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (timeOffId: number) => deleteTimeOff(timeOffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-availability'] })
    },
  })
}
