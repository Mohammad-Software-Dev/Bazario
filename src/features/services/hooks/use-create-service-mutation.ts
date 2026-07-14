import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createService } from '@/features/services/api/services-api'
import type { ServiceFormValues } from '@/features/services/schemas/service-form-schema'

export function useCreateServiceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ServiceFormValues) => createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['home'] })
    },
  })
}
