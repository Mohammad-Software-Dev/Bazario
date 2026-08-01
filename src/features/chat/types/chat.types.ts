import type { LaravelPaginatedResponse } from '@/lib/api/laravel-pagination'

export interface ChatPeer {
  id: number
  name: string
  email: string | null
}

export interface ChatMessageSender {
  id: number
  name: string | null
}

export interface ChatMessage {
  id: number
  body: string
  meta?: Record<string, unknown> | null
  sender_id?: number
  recipient_id?: number
  sender: ChatMessageSender
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export interface ChatConversationListItem {
  id: number
  type: string
  last_message_at: string | null
  unread_count: number
  peer: ChatPeer | null
  latest_message: ChatMessage | null
}

export interface ChatUnreadCountResult {
  total: number
}

export interface StartDirectConversationPayload {
  user_id: number
}

export interface StartDirectConversationResult {
  success: number
  conversation: {
    id: number
    type: string
    direct_key: string
  }
}

export interface SendMessagePayload {
  body: string
}

export interface SendMessageResult {
  success: number
  message: ChatMessage
}

export interface ChatUnreadCountResponse {
  success: number
  result: ChatUnreadCountResult
}

export interface ChatConversationListResponse {
  success: number
  result: LaravelPaginatedResponse<ChatConversationListItem>
}

export interface ChatMessagesResponse {
  success: number
  result: LaravelPaginatedResponse<ChatMessage>
}

export interface MarkConversationReadResult {
  success: number
  updated: number
  read_at: string
}

export interface MarkMessageDeliveryResult {
  success: number
  delivered_at: string | null
  changed: boolean
}

export interface MarkMessageReadResult {
  success: number
  read_at: string | null
  changed: boolean
}

export interface ChatRealtimeMessageEvent {
  id: number
  body: string
  meta?: Record<string, unknown> | null
  sender: ChatMessageSender
  recipient_id: number
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export interface ChatRealtimeStatusEvent {
  id: number
  delivered_at?: string | null
  read_at?: string | null
}
