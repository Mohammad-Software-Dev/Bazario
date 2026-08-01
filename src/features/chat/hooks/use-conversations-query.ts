import { useQuery } from '@tanstack/react-query'

import { getConversations } from '@/features/chat/api/chat-api'

export function useConversationsQuery(perPage = 20, enabled = true) {
  return useQuery({
    queryKey: ['chat', 'conversations', perPage],
    queryFn: () => getConversations(perPage),
    enabled,
  })
}
