import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeOffForm } from '@/features/provider-availability/components/time-off-form'
import { WorkingHoursEditor } from '@/features/provider-availability/components/working-hours-editor'
import { useAddTimeOffMutation } from '@/features/provider-availability/hooks/use-add-time-off-mutation'
import { useDeleteTimeOffMutation } from '@/features/provider-availability/hooks/use-delete-time-off-mutation'
import { useProviderAvailabilityQuery } from '@/features/provider-availability/hooks/use-provider-availability-query'
import { useUpdateWorkingHoursMutation } from '@/features/provider-availability/hooks/use-update-working-hours-mutation'
import type { TimeOffFormValues } from '@/features/provider-availability/schemas/time-off-form-schema'
import type {
  AddTimeOffPayload,
  ProviderAvailabilityResult,
  WorkingHourDayInput,
} from '@/features/provider-availability/types/provider-availability.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

function buildInitialDays(provider: ProviderAvailabilityResult | undefined): WorkingHourDayInput[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    day_of_week: dayOfWeek,
    intervals: (provider?.working_hours ?? [])
      .filter((item) => item.day_of_week === dayOfWeek)
      .map((item) => ({ end_time: item.end_time, start_time: item.start_time })),
  }))
}

interface AvailabilityDraft {
  providerId: number | null
  timezone: string
  days: WorkingHourDayInput[]
}

function cloneDays(days: WorkingHourDayInput[]) {
  return days.map((day) => ({
    day_of_week: day.day_of_week,
    intervals: day.intervals.map((interval) => ({ ...interval })),
  }))
}

export function ProviderAvailabilityPage() {
  const providerAvailabilityQuery = useProviderAvailabilityQuery()
  const updateWorkingHoursMutation = useUpdateWorkingHoursMutation()
  const addTimeOffMutation = useAddTimeOffMutation()
  const deleteTimeOffMutation = useDeleteTimeOffMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const provider = providerAvailabilityQuery.data
  const initialTimezone = provider?.timezone ?? 'Asia/Dubai'
  const initialDays = useMemo(() => buildInitialDays(provider), [provider])
  const [draft, setDraft] = useState<AvailabilityDraft | null>(null)

  const isDraftForCurrentProvider = draft?.providerId === (provider?.id ?? null)
  const timezone = isDraftForCurrentProvider ? draft.timezone : initialTimezone
  const days = isDraftForCurrentProvider ? draft.days : initialDays

  const sortedTimeOffs = useMemo(
    () => [...(provider?.time_offs ?? [])].sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    [provider?.time_offs],
  )

  function updateDraft(updater: (current: AvailabilityDraft) => AvailabilityDraft) {
    setDraft((currentDraft) => {
      const baseDraft: AvailabilityDraft =
        currentDraft?.providerId === (provider?.id ?? null)
          ? currentDraft
          : {
              providerId: provider?.id ?? null,
              timezone: initialTimezone,
              days: cloneDays(initialDays),
            }

      return updater(baseDraft)
    })
  }

  function updateDay(dayOfWeek: number, updater: (day: WorkingHourDayInput) => WorkingHourDayInput) {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      days: currentDraft.days.map((day) => (day.day_of_week === dayOfWeek ? updater(day) : day)),
    }))
  }

  function handleAddInterval(dayOfWeek: number) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: [...day.intervals, { start_time: '09:00', end_time: '17:00' }],
    }))
  }

  function handleRemoveInterval(dayOfWeek: number, intervalIndex: number) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: day.intervals.filter((_, index) => index !== intervalIndex),
    }))
  }

  function handleIntervalChange(
    dayOfWeek: number,
    intervalIndex: number,
    field: 'start_time' | 'end_time',
    value: string,
  ) {
    updateDay(dayOfWeek, (day) => ({
      ...day,
      intervals: day.intervals.map((interval, index) =>
        index === intervalIndex ? { ...interval, [field]: value } : interval,
      ),
    }))
  }

  async function handleSaveWorkingHours() {
    setServerError(null)

    try {
      await updateWorkingHoursMutation.mutateAsync({ timezone, days })
      setDraft(null)
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to update working hours right now.'))
    }
  }

  async function handleAddTimeOff(values: TimeOffFormValues) {
    setServerError(null)

    const payload: AddTimeOffPayload = {
      starts_at: values.starts_at,
      ends_at: values.ends_at,
      is_holiday: values.is_holiday,
      reason: values.reason.trim() || undefined,
      timezone,
    }

    try {
      await addTimeOffMutation.mutateAsync(payload)
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to add time off right now.'))
    }
  }

  async function handleDeleteTimeOff(timeOffId: number) {
    const confirmed = window.confirm('Delete this time-off entry?')

    if (!confirmed) {
      return
    }

    setServerError(null)

    try {
      await deleteTimeOffMutation.mutateAsync(timeOffId)
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to delete this time-off entry right now.'))
    }
  }

  if (providerAvailabilityQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">Loading availability...</CardContent>
        </Card>
      </div>
    )
  }

  if (providerAvailabilityQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(providerAvailabilityQuery.error, 'Unable to load provider availability right now.')}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Provider workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Availability</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/provider/services">Back to services</Link>
        </Button>
      </div>

      {serverError ? (
        <Card>
          <CardContent className="py-4 text-sm text-destructive">{serverError}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Provider schedule</CardTitle>
          <CardDescription>
            Set your general working hours. Service slots are calculated from this schedule plus each service&apos;s booking rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-w-sm space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="provider-timezone">
              Timezone
            </label>
            <input
              id="provider-timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={timezone}
              onChange={(event) => {
                const nextTimezone = event.target.value

                updateDraft((currentDraft) => ({
                  ...currentDraft,
                  timezone: nextTimezone,
                }))
              }}
            />
          </div>

          <WorkingHoursEditor
            days={days}
            onAddInterval={handleAddInterval}
            onIntervalChange={handleIntervalChange}
            onRemoveInterval={handleRemoveInterval}
          />

          <Button onClick={handleSaveWorkingHours} disabled={updateWorkingHoursMutation.isPending}>
            {updateWorkingHoursMutation.isPending ? 'Saving schedule...' : 'Save working hours'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add time off</CardTitle>
            <CardDescription>Use time off for holidays, days off, or temporary unavailability.</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeOffForm isSubmitting={addTimeOffMutation.isPending} onSubmit={handleAddTimeOff} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing time off</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedTimeOffs.length ? (
              sortedTimeOffs.map((timeOff) => (
                <div key={timeOff.id} className="rounded-lg border p-4 text-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{timeOff.is_holiday ? 'Holiday' : 'Time off'}</p>
                      <p className="text-muted-foreground">{timeOff.starts_at} to {timeOff.ends_at}</p>
                      {timeOff.reason ? <p className="text-muted-foreground">{timeOff.reason}</p> : null}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteTimeOff(timeOff.id)}
                      disabled={deleteTimeOffMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No time off entries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
