import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateService } from '@/features/services/api/services-api'
import type { ServiceFormValues } from '@/features/services/schemas/service-form-schema'

interface UpdateServiceVariables {
  payload: ServiceFormValues
  serviceId: number
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ serviceId, payload }: UpdateServiceVariables) => updateService(serviceId, payload),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['service', variables.serviceId] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
