import { Button } from '@/components/ui/button'
import type { ProviderTimeOff } from '@/features/provider-availability/types/provider-availability.types'
import { formatTimeOffDate } from '@/features/provider-availability/lib/provider-availability'

interface TimeOffListProps {
  isDeleting: boolean
  timeOffs: ProviderTimeOff[]
  timezone: string
  onDelete: (timeOffId: number) => void
}

export function TimeOffList({ isDeleting, timeOffs, timezone, onDelete }: TimeOffListProps) {
  if (!timeOffs.length) {
    return <p className="text-sm text-muted-foreground">No time off entries yet.</p>
  }

  return (
    <div className="space-y-3">
      {timeOffs.map((timeOff) => (
        <div key={timeOff.id} className="rounded-lg border p-4 text-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">{timeOff.is_holiday ? 'Holiday' : 'Time off'}</p>
              <p className="text-muted-foreground">
                {formatTimeOffDate(timeOff.starts_at, timezone)} to {formatTimeOffDate(timeOff.ends_at, timezone)}
              </p>
              <p className="text-xs text-muted-foreground">Timezone: {timezone}</p>
              {timeOff.reason ? <p className="text-muted-foreground">{timeOff.reason}</p> : null}
            </div>
            <Button variant="outline" onClick={() => onDelete(timeOff.id)} disabled={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
