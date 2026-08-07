import { useTranslation } from 'react-i18next'
import type { KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatMessageComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSending: boolean
  disabled?: boolean
}

export function ChatMessageComposer({
  value,
  onChange,
  onSubmit,
  isSending,
  disabled = false,
}: ChatMessageComposerProps) {
  const { t } = useTranslation()

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }

    event.preventDefault()

    if (disabled || isSending || !value.trim()) {
      return
    }

    onSubmit()
  }

  return (
    <div className="space-y-3 border-t pt-4">
      <Textarea
        aria-label={t('chat.messageInputLabel')}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chat.messagePlaceholder')}
        disabled={disabled || isSending}
        className="min-h-28 resize-none"
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{t('chat.sendShortcutHint')}</p>
        <Button onClick={onSubmit} disabled={disabled || isSending || !value.trim()}>
          {isSending ? t('chat.sending') : t('chat.send')}
        </Button>
      </div>
    </div>
  )
}
