import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeOffForm } from '@/features/provider-availability/components/time-off-form'
import { TimeOffList } from '@/features/provider-availability/components/time-off-list'
import { WorkingHoursEditor } from '@/features/provider-availability/components/working-hours-editor'
import { useAddTimeOffMutation } from '@/features/provider-availability/hooks/use-add-time-off-mutation'
import { useDeleteTimeOffMutation } from '@/features/provider-availability/hooks/use-delete-time-off-mutation'
import { useProviderAvailabilityDraft } from '@/features/provider-availability/hooks/use-provider-availability-draft'
import { useProviderAvailabilityQuery } from '@/features/provider-availability/hooks/use-provider-availability-query'
import { useUpdateWorkingHoursMutation } from '@/features/provider-availability/hooks/use-update-working-hours-mutation'
import {
  normalizeWorkingHoursPayload,
  sortTimeOffs,
} from '@/features/provider-availability/lib/provider-availability'
import type { TimeOffFormValues } from '@/features/provider-availability/schemas/time-off-form-schema'
import type { AddTimeOffPayload } from '@/features/provider-availability/types/provider-availability.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function ProviderAvailabilityPage() {
  const providerAvailabilityQuery = useProviderAvailabilityQuery()
  const updateWorkingHoursMutation = useUpdateWorkingHoursMutation()
  const addTimeOffMutation = useAddTimeOffMutation()
  const deleteTimeOffMutation = useDeleteTimeOffMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const provider = providerAvailabilityQuery.data
  const { days, timezone, timezoneOptions, addInterval, changeInterval, clearDraft, removeInterval, setTimezone } =
    useProviderAvailabilityDraft(provider)
  const sortedTimeOffs = useMemo(() => sortTimeOffs(provider?.time_offs ?? []), [provider?.time_offs])

  async function handleSaveWorkingHours() {
    setServerError(null)

    const normalizedDays = normalizeWorkingHoursPayload(days)

    if (!normalizedDays.length) {
      setServerError('Add at least one working-hours interval before saving.')
      return
    }

    try {
      await updateWorkingHoursMutation.mutateAsync({ timezone, days: normalizedDays })
      clearDraft()
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
            <select
              id="provider-timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
            >
              {timezoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <WorkingHoursEditor
            days={days}
            onAddInterval={addInterval}
            onIntervalChange={changeInterval}
            onRemoveInterval={removeInterval}
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
          <CardContent>
            <TimeOffList
              isDeleting={deleteTimeOffMutation.isPending}
              timeOffs={sortedTimeOffs}
              timezone={timezone}
              onDelete={handleDeleteTimeOff}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
