import { useMutation, useQueryClient } from '@tanstack/react-query'

import { sendMessage } from '@/features/chat/api/chat-api'
import type {
  ChatConversationListItem,
  ChatConversationListResponse,
  ChatMessage,
  ChatMessagesResponse,
} from '@/features/chat/types/chat.types'

function sortConversations(conversations: ChatConversationListItem[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.last_message_at ? new Date(left.last_message_at).getTime() : 0
    const rightTime = right.last_message_at ? new Date(right.last_message_at).getTime() : 0

    if (leftTime !== rightTime) {
      return rightTime - leftTime
    }

    return right.id - left.id
  })
}

function updateConversationPreview(
  conversations: ChatConversationListItem[],
  conversationId: number,
  message: ChatMessage,
) {
  return sortConversations(
    conversations.map((conversation) => {
      if (conversation.id !== conversationId) {
        return conversation
      }

      return {
        ...conversation,
        last_message_at: message.created_at,
        latest_message: message,
        unread_count: 0,
      }
    }),
  )
}

export function useSendMessageMutation(conversationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, { body }),
    onSuccess: ({ message }) => {
      queryClient.setQueryData<ChatMessagesResponse | undefined>(
        ['chat', 'messages', conversationId],
        (currentData) => {
          if (!currentData?.result) {
            return currentData
          }

          if (currentData.result.data.some((existingMessage) => existingMessage.id === message.id)) {
            return currentData
          }

          return {
            ...currentData,
            result: {
              ...currentData.result,
              data: [...currentData.result.data, message],
              total: currentData.result.total + 1,
              to: (currentData.result.to ?? currentData.result.data.length) + 1,
            },
          }
        },
      )

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
              data: updateConversationPreview(currentData.result.data, conversationId, message),
            },
          }
        },
      )
    },
  })
}
