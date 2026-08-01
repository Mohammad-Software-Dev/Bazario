import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { subscribePrivateChannel, unsubscribePrivateChannel } from '@/features/chat/lib/pusher-client'
import type { ChatUnreadCountResponse, ChatRealtimeStatusEvent } from '@/features/chat/types/chat.types'

export function useChatUnreadSubscription(userId: number | null | undefined, enabled = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !userId) {
      return
    }

    const channelName = `private-user.${userId}`
    const channel = subscribePrivateChannel(channelName)

    if (!channel) {
      return
    }

    const handleUnreadUpdated = (payload: ChatRealtimeStatusEvent & { total?: number }) => {
      const total = payload.total

      if (typeof total !== 'number') {
        return
      }

      queryClient.setQueryData<ChatUnreadCountResponse | undefined>(['chat', 'unreadCount'], (currentData) => {
        if (!currentData) {
          return {
            success: 1,
            result: { total },
          }
        }

        return {
          ...currentData,
          result: {
            ...currentData.result,
            total,
          },
        }
      })
    }

    channel.bind('conversations.unread', handleUnreadUpdated)

    return () => {
      channel.unbind('conversations.unread', handleUnreadUpdated)
      unsubscribePrivateChannel(channelName)
    }
  }, [enabled, queryClient, userId])
}
