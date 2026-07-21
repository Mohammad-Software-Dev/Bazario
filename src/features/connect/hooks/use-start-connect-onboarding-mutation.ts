import { useMutation, useQueryClient } from '@tanstack/react-query'

import { startConnectOnboarding } from '@/features/connect/api/connect-api'

export function useStartConnectOnboardingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startConnectOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connect', 'status'] })
      queryClient.invalidateQueries({ queryKey: ['connect', 'summary'] })
    },
  })
}
