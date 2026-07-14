import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkingHourDayInput } from '@/features/provider-availability/types/provider-availability.types'

interface WorkingHoursEditorProps {
  days: WorkingHourDayInput[]
  onAddInterval: (dayOfWeek: number) => void
  onIntervalChange: (dayOfWeek: number, intervalIndex: number, field: 'start_time' | 'end_time', value: string) => void
  onRemoveInterval: (dayOfWeek: number, intervalIndex: number) => void
}

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function WorkingHoursEditor({
  days,
  onAddInterval,
  onIntervalChange,
  onRemoveInterval,
}: WorkingHoursEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {days.map((day) => (
        <Card key={day.day_of_week}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">{dayLabels[day.day_of_week]}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddInterval(day.day_of_week)}
              disabled={day.intervals.length >= 6}
            >
              Add interval
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {day.intervals.length ? (
              day.intervals.map((interval, intervalIndex) => (
                <div key={`${day.day_of_week}-${intervalIndex}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Input
                      type="time"
                      value={interval.start_time}
                      onChange={(event) => onIntervalChange(day.day_of_week, intervalIndex, 'start_time', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End</Label>
                    <Input
                      type="time"
                      value={interval.end_time}
                      onChange={(event) => onIntervalChange(day.day_of_week, intervalIndex, 'end_time', event.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onRemoveInterval(day.day_of_week, intervalIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No intervals set for this day.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
