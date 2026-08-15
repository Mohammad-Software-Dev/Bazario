import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
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
import type { AddTimeOffPayload, ProviderTimeOff } from '@/features/provider-availability/types/provider-availability.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

export function ProviderAvailabilityPage() {
  const { t } = useTranslation()
  const providerAvailabilityQuery = useProviderAvailabilityQuery()
  const updateWorkingHoursMutation = useUpdateWorkingHoursMutation()
  const addTimeOffMutation = useAddTimeOffMutation()
  const deleteTimeOffMutation = useDeleteTimeOffMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [timeOffToDelete, setTimeOffToDelete] = useState<ProviderTimeOff | null>(null)
  const provider = providerAvailabilityQuery.data
  const { days, timezone, timezoneOptions, addInterval, changeInterval, clearDraft, removeInterval, setTimezone } =
    useProviderAvailabilityDraft(provider)
  const sortedTimeOffs = useMemo(() => sortTimeOffs(provider?.time_offs ?? []), [provider?.time_offs])
  const isDeleting = deleteTimeOffMutation.isPending && deleteTimeOffMutation.variables === timeOffToDelete?.id

  async function handleSaveWorkingHours() {
    setServerError(null)

    const normalizedDays = normalizeWorkingHoursPayload(days)

    if (!normalizedDays.length) {
      setServerError(t('provider.workingHoursRequired'))
      return
    }

    try {
      await updateWorkingHoursMutation.mutateAsync({ timezone, days: normalizedDays })
      clearDraft()
    } catch (error) {
      setServerError(getApiErrorMessage(error, t('provider.updateWorkingHoursError')))
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
      setServerError(getApiErrorMessage(error, t('provider.addTimeOffError')))
    }
  }

  async function confirmDeleteTimeOff() {
    if (!timeOffToDelete) {
      return
    }

    setServerError(null)

    try {
      await deleteTimeOffMutation.mutateAsync(timeOffToDelete.id)
      setTimeOffToDelete(null)
    } catch (error) {
      setServerError(getApiErrorMessage(error, t('provider.deleteTimeOffError')))
    }
  }

  if (providerAvailabilityQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t('provider.loadingAvailability')}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (providerAvailabilityQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(providerAvailabilityQuery.error, t('provider.loadAvailabilityError'))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{t('provider.workspace')}</p>
            <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
              {t('provider.availability')}
            </h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/account/provider/services">{t('common.backToServices')}</Link>
          </Button>
        </div>

        {serverError ? (
          <Card>
            <CardContent className="py-4 text-sm text-destructive">{serverError}</CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{t('provider.schedule')}</CardTitle>
            <CardDescription>{t('provider.scheduleDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="max-w-sm space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="provider-timezone">
                {t('provider.timezone')}
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
              {updateWorkingHoursMutation.isPending ? t('common.saving') : t('provider.saveWorkingHours')}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t('provider.addTimeOff')}</CardTitle>
              <CardDescription>{t('provider.addTimeOffDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeOffForm isSubmitting={addTimeOffMutation.isPending} onSubmit={handleAddTimeOff} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('provider.existingTimeOff')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeOffList
                isDeleting={deleteTimeOffMutation.isPending}
                timeOffs={sortedTimeOffs}
                timezone={timezone}
                onDelete={(timeOffId) => {
                  setTimeOffToDelete(sortedTimeOffs.find((timeOff) => timeOff.id === timeOffId) ?? null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(timeOffToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setTimeOffToDelete(null)
          }
        }}
        title={t('provider.deleteTimeOffTitle')}
        description={t('provider.deleteTimeOffDescription')}
        confirmLabel={isDeleting ? t('common.deleting') : t('provider.deleteTimeOffTitle')}
        cancelLabel={t('provider.keepTimeOff')}
        onConfirm={confirmDeleteTimeOff}
        isPending={isDeleting}
        variant="destructive"
      />
    </>
  )
}
