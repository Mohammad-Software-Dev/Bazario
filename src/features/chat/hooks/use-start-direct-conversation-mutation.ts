import { useMutation, useQueryClient } from '@tanstack/react-query'

import { startDirectConversation } from '@/features/chat/api/chat-api'

export function useStartDirectConversationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startDirectConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] })
      queryClient.invalidateQueries({ queryKey: ['chat', 'unreadCount'] })
    },
  })
}
