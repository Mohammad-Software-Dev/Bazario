import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useStartDirectConversationMutation } from '@/features/chat/hooks/use-start-direct-conversation-mutation'
import { useAuth } from '@/lib/auth/use-auth'
import { useAppLanguage } from '@/lib/i18n/use-app-language'
import { cn } from '@/lib/utils'
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
  const { isRtl } = useAppLanguage()
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
      <span className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
        <MessageCircle className="size-4 shrink-0" />
        <span>{directConversationMutation.isPending ? t('chat.openingConversation') : label}</span>
      </span>
    </Button>
  )
}
