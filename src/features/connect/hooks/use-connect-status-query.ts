import { useQuery } from '@tanstack/react-query'

import { getConnectStatus } from '@/features/connect/api/connect-api'

export function useConnectStatusQuery(enabled = true) {
  return useQuery({
    queryKey: ['connect', 'status'],
    queryFn: getConnectStatus,
    enabled,
  })
}
