import { useMutation, useQueryClient } from '@tanstack/react-query'

import { markConversationRead } from '@/features/chat/api/chat-api'
import type { ChatConversationListItem, ChatConversationListResponse, ChatUnreadCountResponse } from '@/features/chat/types/chat.types'

export function useMarkConversationReadMutation(conversationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markConversationRead(conversationId),
    onSuccess: () => {
      queryClient.setQueryData<ChatUnreadCountResponse | undefined>(['chat', 'unreadCount'], (currentData) => {
        if (!currentData?.result) {
          return currentData
        }

        return {
          ...currentData,
          result: {
            ...currentData.result,
            total: Math.max(0, currentData.result.total - 1),
          },
        }
      })

      queryClient.setQueriesData<ChatConversationListResponse | undefined>(
        { queryKey: ['chat', 'conversations'] },
        (currentData) => {
          if (!currentData?.result?.data) {
            return currentData
          }

          return {
            ...currentData,
            result: {
              ...currentData.result,
              data: currentData.result.data.map((conversation: ChatConversationListItem) =>
                conversation.id === conversationId ? { ...conversation, unread_count: 0 } : conversation,
              ),
            },
          }
        },
      )
    },
  })
}
