import { useQuery } from '@tanstack/react-query'

import { getHome } from '@/features/home/api/home-api'

interface UseHomeQueryOptions {
  latestLimit?: number
}

export function useHomeQuery(options: UseHomeQueryOptions = {}) {
  return useQuery({
    queryKey: ['home', options],
    queryFn: () => getHome(options),
  })
}
