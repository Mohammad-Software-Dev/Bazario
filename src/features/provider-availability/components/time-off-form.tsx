import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { timeOffFormSchema, type TimeOffFormValues } from '@/features/provider-availability/schemas/time-off-form-schema'

interface TimeOffFormProps {
  isSubmitting: boolean
  onSubmit: (values: TimeOffFormValues) => void
}

export function TimeOffForm({ isSubmitting, onSubmit }: TimeOffFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeOffFormValues>({
    resolver: zodResolver(timeOffFormSchema),
    defaultValues: {
      starts_at: '',
      ends_at: '',
      is_holiday: false,
      reason: '',
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="time-off-starts-at">Starts at</Label>
          <Input id="time-off-starts-at" type="datetime-local" {...register('starts_at')} />
          {errors.starts_at ? <p className="text-sm text-destructive">{errors.starts_at.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-off-ends-at">Ends at</Label>
          <Input id="time-off-ends-at" type="datetime-local" {...register('ends_at')} />
          {errors.ends_at ? <p className="text-sm text-destructive">{errors.ends_at.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-off-reason">Reason</Label>
        <Textarea id="time-off-reason" rows={3} {...register('reason')} />
        {errors.reason ? <p className="text-sm text-destructive">{errors.reason.message}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <input id="time-off-holiday" type="checkbox" className="h-4 w-4" {...register('is_holiday')} />
        <Label htmlFor="time-off-holiday">Mark as holiday</Label>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add time off'}
      </Button>
    </form>
  )
}
