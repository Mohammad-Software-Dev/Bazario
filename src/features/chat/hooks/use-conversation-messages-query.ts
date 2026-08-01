import { useQuery } from '@tanstack/react-query'

import { getConversationMessages } from '@/features/chat/api/chat-api'

export function useConversationMessagesQuery(conversationId: number, enabled = true) {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled,
  })
}
