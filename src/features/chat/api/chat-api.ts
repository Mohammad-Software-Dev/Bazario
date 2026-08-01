import { httpClient } from '@/lib/api/http-client'

import { chatEndpoints } from '@/features/chat/api/chat-endpoints'
import type {
  ChatConversationListResponse,
  ChatMessagesResponse,
  ChatUnreadCountResponse,
  MarkConversationReadResult,
  MarkMessageDeliveryResult,
  MarkMessageReadResult,
  SendMessagePayload,
  SendMessageResult,
  StartDirectConversationPayload,
  StartDirectConversationResult,
} from '@/features/chat/types/chat.types'

export async function getUnreadConversationCount() {
  const response = await httpClient.get<ChatUnreadCountResponse>(chatEndpoints.unreadCount)

  return response.data
}

export async function getConversations(perPage = 20) {
  const response = await httpClient.get<ChatConversationListResponse>(chatEndpoints.conversations, {
    params: { per_page: perPage },
  })

  return response.data
}

export async function startDirectConversation(payload: StartDirectConversationPayload) {
  const response = await httpClient.post<StartDirectConversationResult>(chatEndpoints.directConversation, payload)

  return response.data
}

export async function getConversationMessages(conversationId: number) {
  const firstPageResponse = await httpClient.get<ChatMessagesResponse>(chatEndpoints.messages(conversationId))
  const firstPage = firstPageResponse.data
  const lastPage = firstPage.result.last_page

  if (lastPage <= 1) {
    return firstPage
  }

  const latestPageResponse = await httpClient.get<ChatMessagesResponse>(chatEndpoints.messages(conversationId), {
    params: { page: lastPage },
  })

  return latestPageResponse.data
}

export async function sendMessage(conversationId: number, payload: SendMessagePayload) {
  const response = await httpClient.post<SendMessageResult>(chatEndpoints.messages(conversationId), payload)

  return response.data
}

export async function markConversationRead(conversationId: number) {
  const response = await httpClient.post<MarkConversationReadResult>(chatEndpoints.markConversationRead(conversationId))

  return response.data
}

export async function acknowledgeMessageDelivered(messageId: number) {
  const response = await httpClient.post<MarkMessageDeliveryResult>(chatEndpoints.markDelivered(messageId))

  return response.data
}

export async function markMessageRead(messageId: number) {
  const response = await httpClient.post<MarkMessageReadResult>(chatEndpoints.markRead(messageId))

  return response.data
}
