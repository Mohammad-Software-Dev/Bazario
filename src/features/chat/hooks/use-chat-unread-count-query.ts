import { useQuery } from '@tanstack/react-query'

import { getUnreadConversationCount } from '@/features/chat/api/chat-api'

export function useChatUnreadCountQuery(enabled = true) {
  return useQuery({
    queryKey: ['chat', 'unreadCount'],
    queryFn: getUnreadConversationCount,
    enabled,
  })
}
