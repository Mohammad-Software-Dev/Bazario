import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategoriesQuery } from '@/features/categories/hooks/use-categories-query'
import { ServiceForm } from '@/features/services/components/service-form'
import { useCreateServiceMutation } from '@/features/services/hooks/use-create-service-mutation'
import type { ServiceFormValues } from '@/features/services/schemas/service-form-schema'
import { useServiceQuery } from '@/features/services/hooks/use-service-query'
import { useUpdateServiceMutation } from '@/features/services/hooks/use-update-service-mutation'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parseServiceId(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function ServiceEditorPage() {
  const navigate = useNavigate()
  const { serviceId: serviceIdParam } = useParams()
  const serviceId = parseServiceId(serviceIdParam)
  const isEditMode = serviceId !== null
  const categoriesQuery = useCategoriesQuery('service')
  const serviceQuery = useServiceQuery(serviceId ?? 0, isEditMode)
  const createServiceMutation = useCreateServiceMutation()
  const updateServiceMutation = useUpdateServiceMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  async function handleSubmit(values: ServiceFormValues) {
    setServerError(null)

    try {
      if (isEditMode && serviceId) {
        await updateServiceMutation.mutateAsync({ serviceId, payload: values })
      } else {
        await createServiceMutation.mutateAsync(values)
      }

      navigate('/account/provider/services')
    } catch (error) {
      setServerError(getApiErrorMessage(error, 'Unable to save this service right now.'))
    }
  }

  if (isEditMode && !serviceId) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">Invalid service id.</CardContent>
        </Card>
      </div>
    )
  }

  if (isEditMode && serviceQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle>Loading service...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-32 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditMode && serviceQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(serviceQuery.error, 'Unable to load this service right now.')}
          </CardContent>
        </Card>
      </div>
    )
  }

  const service = serviceQuery.data?.result
  const isSubmitting = createServiceMutation.isPending || updateServiceMutation.isPending

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Provider workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {isEditMode ? 'Edit service' : 'Create service'}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account/provider/services">Back to services</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Update service details' : 'New service details'}</CardTitle>
          <CardDescription>
            Configure the service content and booking rules that the public availability flow will use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError ? <p className="text-sm text-destructive">{serverError}</p> : null}

          <ServiceForm
            categories={categoriesQuery.data?.result ?? []}
            initialService={service}
            isCategoriesLoading={categoriesQuery.isLoading}
            isSubmitting={isSubmitting}
            mode={isEditMode ? 'edit' : 'create'}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}
