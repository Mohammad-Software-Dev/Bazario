import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/features/account/api/account-api'

export function useMeQuery(includeSummary = false, limit?: number, enabled = true) {
  return useQuery({
    queryKey: ['me', { includeSummary, limit }],
    queryFn: () => getMe(includeSummary, limit),
    enabled,
  })
}
