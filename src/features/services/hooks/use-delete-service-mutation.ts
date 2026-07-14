import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteService } from '@/features/services/api/services-api'

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceId: number) => deleteService(serviceId),
    onSuccess: (_result, serviceId) => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['service', serviceId] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
