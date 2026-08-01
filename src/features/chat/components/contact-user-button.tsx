import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useStartDirectConversationMutation } from '@/features/chat/hooks/use-start-direct-conversation-mutation'
import { useAuth } from '@/lib/auth/use-auth'
import { useUiStore } from '@/stores/ui-store'

interface ContactUserButtonProps {
  userId: number | null
  isOwner: boolean
  label: string
}

export function ContactUserButton({ userId, isOwner, label }: ContactUserButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const openLoginDialog = useUiStore((state) => state.openLoginDialog)
  const directConversationMutation = useStartDirectConversationMutation()

  if (!userId || isOwner) {
    return null
  }

  function handleClick() {
    if (!isAuthenticated) {
      openLoginDialog()
      return
    }

    if (!userId) {
      return
    }

    directConversationMutation.mutate(
      { user_id: userId },
      {
        onSuccess: ({ conversation }) => {
          navigate(`/chat/${conversation.id}`)
        },
      },
    )
  }

  return (
    <Button onClick={handleClick} disabled={directConversationMutation.isPending} className="w-full">
      <MessageCircle className="mr-2 size-4" />
      {directConversationMutation.isPending ? t('chat.openingConversation') : label}
    </Button>
  )
}
