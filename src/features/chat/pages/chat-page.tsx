import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { Card, CardContent } from '@/components/ui/card'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { useAuth } from '@/lib/auth/use-auth'

import { acknowledgeMessageDelivered, markConversationRead, markMessageRead } from '@/features/chat/api/chat-api'
import { ChatConversationList } from '@/features/chat/components/chat-conversation-list'
import { ChatThread } from '@/features/chat/components/chat-thread'
import { useConversationMessagesQuery } from '@/features/chat/hooks/use-conversation-messages-query'
import { useConversationsQuery } from '@/features/chat/hooks/use-conversations-query'
import { useSendMessageMutation } from '@/features/chat/hooks/use-send-message-mutation'
import { subscribePrivateChannel, unsubscribePrivateChannel } from '@/features/chat/lib/pusher-client'
import type {
  ChatConversationListItem,
  ChatConversationListResponse,
  ChatMessage,
  ChatMessagesResponse,
  ChatRealtimeMessageEvent,
  ChatRealtimeStatusEvent,
  ChatUnreadCountResponse,
} from '@/features/chat/types/chat.types'

function parseConversationId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

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

export function ChatPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { conversationId: conversationIdParam } = useParams()
  const { session } = useAuth()
  const [messageBody, setMessageBody] = useState('')
  const [isCompactLayout, setIsCompactLayout] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth < 1024
  })
  const activeConversationId = parseConversationId(conversationIdParam)
  const conversationsQuery = useConversationsQuery(20, true)
  const conversations = useMemo(() => conversationsQuery.data?.result.data ?? [], [conversationsQuery.data])
  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  )

  const messagesQuery = useConversationMessagesQuery(activeConversationId ?? 0, Boolean(activeConversationId))
  const sendMessageMutation = useSendMessageMutation(activeConversationId ?? 0)

  useEffect(() => {
    if (isCompactLayout || activeConversationId || !conversations.length) {
      return
    }

    navigate(`/chat/${conversations[0].id}`, { replace: true })
  }, [activeConversationId, conversations, isCompactLayout, navigate])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 1023px)')

    function handleChange(event: MediaQueryListEvent | MediaQueryList) {
      setIsCompactLayout(event.matches)
    }

    handleChange(mediaQuery)

    const supportsModernListener = typeof mediaQuery.addEventListener === 'function'

    if (supportsModernListener) {
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    mediaQuery.addListener(handleChange)

    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  useEffect(() => {
    if (!activeConversationId || !messagesQuery.data?.result.data.length || !session?.user.id) {
      return
    }

    const unreadForCurrentUser = messagesQuery.data.result.data.some(
      (message) => message.sender.id !== session.user.id && !message.read_at,
    )

    if (!unreadForCurrentUser) {
      return
    }

    markConversationRead(activeConversationId)
      .then(() => {
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
                  conversation.id === activeConversationId ? { ...conversation, unread_count: 0 } : conversation,
                ),
              },
            }
          },
        )
      })
      .catch(() => undefined)
  }, [activeConversationId, messagesQuery.data, queryClient, session?.user.id])

  useEffect(() => {
    if (!conversations.length || !session?.user.id) {
      return
    }

    const subscribedNames = conversations.map((conversation) => `private-chat.${conversation.id}`)

    const unbindCallbacks = subscribedNames.map((channelName, index) => {
      const conversationId = conversations[index].id
      const channel = subscribePrivateChannel(channelName)

      if (!channel) {
        return () => undefined
      }

      const handleMessageSent = async (payload: ChatRealtimeMessageEvent) => {
        const normalizedMessage: ChatMessage = {
          id: payload.id,
          body: payload.body,
          meta: payload.meta ?? null,
          sender: payload.sender,
          recipient_id: payload.recipient_id,
          delivered_at: payload.delivered_at,
          read_at: payload.read_at,
          created_at: payload.created_at,
        }

        queryClient.setQueriesData<ChatConversationListResponse | undefined>(
          { queryKey: ['chat', 'conversations'] },
          (currentData) => {
            if (!currentData?.result?.data) {
              return currentData
            }

            const nextConversations = currentData.result.data.map((conversation: ChatConversationListItem) => {
              if (conversation.id !== conversationId) {
                return conversation
              }

              const isActive = activeConversationId === conversationId
              const isMine = payload.sender.id === session.user.id

              return {
                ...conversation,
                last_message_at: payload.created_at,
                latest_message: normalizedMessage,
                unread_count: isMine || isActive ? 0 : conversation.unread_count + 1,
              }
            })

            return {
              ...currentData,
              result: {
                ...currentData.result,
                data: sortConversations(nextConversations),
              },
            }
          },
        )

        if (activeConversationId === conversationId) {
          queryClient.setQueryData<ChatMessagesResponse | undefined>(
            ['chat', 'messages', conversationId],
            (currentData) => {
              if (!currentData?.result) {
                return currentData
              }

              if (currentData.result.data.some((message: ChatMessage) => message.id === normalizedMessage.id)) {
                return currentData
              }

              return {
                ...currentData,
                result: {
                  ...currentData.result,
                  data: [...currentData.result.data, normalizedMessage],
                  total: currentData.result.total + 1,
                  to: (currentData.result.to ?? currentData.result.data.length) + 1,
                },
              }
            },
          )

          if (payload.sender.id !== session.user.id) {
            try {
              await acknowledgeMessageDelivered(payload.id)
              await markMessageRead(payload.id)
            } catch {
              return
            }
          }
        }
      }

      const handleDelivered = (payload: ChatRealtimeStatusEvent) => {
        queryClient.setQueryData<ChatMessagesResponse | undefined>(
          ['chat', 'messages', conversationId],
          (currentData) => {
            if (!currentData?.result?.data) {
              return currentData
            }

            return {
              ...currentData,
              result: {
                ...currentData.result,
                data: currentData.result.data.map((message: ChatMessage) =>
                  message.id === payload.id
                    ? { ...message, delivered_at: payload.delivered_at ?? message.delivered_at }
                    : message,
                ),
              },
            }
          },
        )
      }

      const handleRead = (payload: ChatRealtimeStatusEvent) => {
        queryClient.setQueryData<ChatMessagesResponse | undefined>(
          ['chat', 'messages', conversationId],
          (currentData) => {
            if (!currentData?.result?.data) {
              return currentData
            }

            return {
              ...currentData,
              result: {
                ...currentData.result,
                data: currentData.result.data.map((message: ChatMessage) =>
                  message.id === payload.id ? { ...message, read_at: payload.read_at ?? message.read_at } : message,
                ),
              },
            }
          },
        )
      }

      channel.bind('message.sent', handleMessageSent)
      channel.bind('message.delivered', handleDelivered)
      channel.bind('message.read', handleRead)

      return () => {
        channel.unbind('message.sent', handleMessageSent)
        channel.unbind('message.delivered', handleDelivered)
        channel.unbind('message.read', handleRead)
      }
    })

    return () => {
      unbindCallbacks.forEach((unbind) => unbind())
      subscribedNames.forEach((name) => unsubscribePrivateChannel(name))
    }
  }, [activeConversationId, conversations, queryClient, session?.user.id])

  const messages = useMemo(() => messagesQuery.data?.result.data ?? [], [messagesQuery.data])

  function handleSendMessage() {
    const nextBody = messageBody.trim()

    if (!activeConversationId || !nextBody) {
      return
    }

    sendMessageMutation.mutate(nextBody, {
      onSuccess: () => {
        setMessageBody('')
      },
    })
  }

  if (activeConversationId === null && conversationIdParam) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">{t('chat.invalidConversation')}</CardContent>
        </Card>
      </div>
    )
  }

  if (conversationsQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">{t('chat.loadingConversations')}</CardContent>
        </Card>
      </div>
    )
  }

  if (conversationsQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(conversationsQuery.error, t('chat.loadConversationsError'))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{t('chat.eyebrow')}</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">{t('chat.pageTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('chat.pageDescription')}</p>
      </div>

      {isCompactLayout ? (
        activeConversationId ? (
          <ChatThread
            conversation={activeConversation}
            messages={messages}
            currentUserId={session?.user.id ?? null}
            messageBody={messageBody}
            onMessageBodyChange={setMessageBody}
            onSendMessage={handleSendMessage}
            isLoading={messagesQuery.isLoading}
            isSending={sendMessageMutation.isPending}
            errorMessage={
              messagesQuery.isError
                ? getApiErrorMessage(messagesQuery.error, t('chat.loadMessagesError'))
                : null
            }
            backHref="/chat"
            showBackButton
          />
        ) : (
          <ChatConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
          />
        )
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <ChatConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
          />
          <ChatThread
            conversation={activeConversation}
            messages={messages}
            currentUserId={session?.user.id ?? null}
            messageBody={messageBody}
            onMessageBodyChange={setMessageBody}
            onSendMessage={handleSendMessage}
            isLoading={messagesQuery.isLoading}
            isSending={sendMessageMutation.isPending}
            errorMessage={
              messagesQuery.isError
                ? getApiErrorMessage(messagesQuery.error, t('chat.loadMessagesError'))
                : null
            }
          />
        </div>
      )}
    </div>
  )
}
