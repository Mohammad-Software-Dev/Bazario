import { useQuery } from '@tanstack/react-query'

import { getConnectSummary } from '@/features/connect/api/connect-api'

export function useConnectSummaryQuery(enabled = true) {
  return useQuery({
    queryKey: ['connect', 'summary'],
    queryFn: getConnectSummary,
    enabled,
  })
}
