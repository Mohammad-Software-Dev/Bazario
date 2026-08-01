export const chatEndpoints = {
  unreadCount: '/api/conversations/unread-count',
  conversations: '/api/conversations',
  directConversation: '/api/conversations/direct',
  messages: (conversationId: number) => `/api/conversations/${conversationId}/messages`,
  markConversationRead: (conversationId: number) => `/api/conversations/${conversationId}/read`,
  markDelivered: (messageId: number) => `/api/messages/${messageId}/delivered`,
  markRead: (messageId: number) => `/api/messages/${messageId}/read`,
} as const
