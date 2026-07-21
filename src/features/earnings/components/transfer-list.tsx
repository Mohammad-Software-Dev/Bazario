import { formatOrderDate, formatOrderMoney } from '@/features/orders/lib/order-format'
import type { ConnectTransferRecord } from '@/features/connect/types/connect.types'

interface TransferListProps {
  transfers: ConnectTransferRecord[]
}

export function TransferList({ transfers }: TransferListProps) {
  if (!transfers.length) {
    return <p className="text-sm text-muted-foreground">No transfers yet.</p>
  }

  return (
    <div className="space-y-3">
      {transfers.map((transfer) => (
        <div key={transfer.transfer_id} className="rounded-lg border p-4 text-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-foreground">Transfer {transfer.transfer_id}</p>
              <p className="text-muted-foreground">Order #{transfer.order_id}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="font-medium text-foreground">
                {formatOrderMoney(transfer.amount, transfer.currency_iso)}
              </p>
              <p className="text-muted-foreground">{transfer.status}</p>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">{formatOrderDate(transfer.created_at)}</p>
        </div>
      ))}
    </div>
  )
}
