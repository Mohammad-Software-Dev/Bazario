import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'

import type { ChatConversationListItem } from '@/features/chat/types/chat.types'

interface ChatConversationListProps {
  conversations: ChatConversationListItem[]
  activeConversationId: number | null
}

export function ChatConversationList({
  conversations,
  activeConversationId,
}: ChatConversationListProps) {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('chat.conversations')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {conversations.length ? (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId
            const latestBody = conversation.latest_message?.body ?? t('chat.noMessagesYet')
            const latestAt = conversation.last_message_at

            return (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={cn(
                  'block rounded-xl border px-4 py-3 transition-colors',
                  isActive
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:bg-muted/40',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold">
                      {conversation.peer?.name ?? t('chat.unknownContact')}
                    </p>
                    <p
                      className={cn(
                        'truncate text-sm',
                        isActive ? 'text-background/80' : 'text-muted-foreground',
                      )}
                    >
                      {latestBody}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {latestAt ? (
                      <p className={cn('text-xs', isActive ? 'text-background/70' : 'text-muted-foreground')}>
                        {formatDateTime(latestAt, {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    ) : null}

                    {conversation.unread_count > 0 ? (
                      <span
                        className={cn(
                          'mt-2 inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-xs font-medium',
                          isActive ? 'bg-background text-foreground' : 'bg-foreground text-background',
                        )}
                      >
                        {conversation.unread_count}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            )
          })
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
            {t('chat.noConversations')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
