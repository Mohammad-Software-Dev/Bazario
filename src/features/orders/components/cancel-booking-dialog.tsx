import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCancelBookingMutation } from '@/features/orders/hooks/use-cancel-booking-mutation'
import { getApiErrorMessage } from '@/lib/api/api-error'

interface CancelBookingDialogProps {
  bookingId: number
  open: boolean
  onOpenChange: (value: boolean) => void
}

export function CancelBookingDialog({ bookingId, open, onOpenChange }: CancelBookingDialogProps) {
  const cancelBookingMutation = useCancelBookingMutation()
  const [reason, setReason] = useState('')

  function handleSubmit() {
    cancelBookingMutation.mutate(
      {
        bookingId,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setReason('')
          onOpenChange(false)
        },
      },
    )
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && !cancelBookingMutation.isPending) {
      setReason('')
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel booking</DialogTitle>
          <DialogDescription>
            Cancel this booking now. If the service policy allows it and the booking is paid, the refund result will be shown after cancellation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="cancel-booking-reason">Reason (optional)</Label>
          <Textarea
            id="cancel-booking-reason"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Add a short note for the provider."
            disabled={cancelBookingMutation.isPending}
          />
        </div>

        {cancelBookingMutation.isError ? (
          <p className="text-sm text-destructive">
            {getApiErrorMessage(cancelBookingMutation.error, 'Unable to cancel this booking right now.')}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={cancelBookingMutation.isPending}>
            Keep booking
          </Button>
          <Button onClick={handleSubmit} disabled={cancelBookingMutation.isPending}>
            {cancelBookingMutation.isPending ? 'Cancelling...' : 'Confirm cancellation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
