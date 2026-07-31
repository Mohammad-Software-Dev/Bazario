import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  isPending?: boolean
  variant?: 'default' | 'destructive'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isPending = false,
  variant = 'default',
}: ConfirmDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (!isPending) {
      onOpenChange(nextOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm} disabled={isPending}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
