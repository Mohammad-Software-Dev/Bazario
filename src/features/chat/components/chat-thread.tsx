import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'

import { ChatMessageComposer } from '@/features/chat/components/chat-message-composer'
import type { ChatConversationListItem, ChatMessage } from '@/features/chat/types/chat.types'

interface ChatThreadProps {
  conversation: ChatConversationListItem | null
  messages: ChatMessage[]
  currentUserId: number | null
  messageBody: string
  onMessageBodyChange: (value: string) => void
  onSendMessage: () => void
  isLoading: boolean
  isSending: boolean
  errorMessage: string | null
}

export function ChatThread({
  conversation,
  messages,
  currentUserId,
  messageBody,
  onMessageBodyChange,
  onSendMessage,
  isLoading,
  isSending,
  errorMessage,
}: ChatThreadProps) {
  const { t } = useTranslation()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <Card className="h-full border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>{conversation?.peer?.name ?? t('chat.selectConversation')}</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[26rem] flex-1 flex-col gap-4 p-4 md:h-[70vh]">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border bg-muted/20 p-4">
          {!conversation ? (
            <p className="text-sm text-muted-foreground">{t('chat.selectConversationPrompt')}</p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">{t('chat.loadingMessages')}</p>
          ) : errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : messages.length ? (
            messages.map((message) => {
              const isMine = currentUserId === message.sender.id

              return (
                <div
                  key={message.id}
                  className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-xs',
                      isMine ? 'bg-foreground text-background' : 'bg-background text-foreground',
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.body}</p>
                    <p
                      className={cn(
                        'mt-2 text-xs',
                        isMine ? 'text-background/70' : 'text-muted-foreground',
                      )}
                    >
                      {formatDateTime(message.created_at, {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">{t('chat.noMessagesYet')}</p>
          )}
          <div ref={bottomRef} />
        </div>

        <ChatMessageComposer
          value={messageBody}
          onChange={onMessageBodyChange}
          onSubmit={onSendMessage}
          isSending={isSending}
          disabled={!conversation}
        />
      </CardContent>
    </Card>
  )
}
