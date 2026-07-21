import { formatOrderMoney } from '@/features/orders/lib/order-format'
import type { ConnectBalanceRow } from '@/features/connect/types/connect.types'

interface BalanceListProps {
  emptyLabel: string
  rows: ConnectBalanceRow[]
}

export function BalanceList({ emptyLabel, rows }: BalanceListProps) {
  if (!rows.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={`${row.currency_iso}-${row.amount}`} className="flex items-center justify-between rounded-lg border p-3 text-sm">
          <span className="text-muted-foreground">{row.currency_iso}</span>
          <span className="font-medium text-foreground">{formatOrderMoney(row.amount, row.currency_iso)}</span>
        </div>
      ))}
    </div>
  )
}
