import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { PaginationControls } from '@/components/shared/pagination-controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ProviderServiceCard } from '@/features/services/components/provider-service-card'
import { useDeleteServiceMutation } from '@/features/services/hooks/use-delete-service-mutation'
import { useMyServicesQuery } from '@/features/services/hooks/use-my-services-query'
import type { ServiceListItem } from '@/features/services/types/service.types'
import { getApiErrorMessage } from '@/lib/api/api-error'

function parsePage(value: string | null) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) {
    return 1
  }

  return page
}

export function ProviderServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = useMemo(() => parsePage(searchParams.get('page')), [searchParams])
  const myServicesQuery = useMyServicesQuery({ page, perPage: 8 })
  const deleteServiceMutation = useDeleteServiceMutation()

  const result = myServicesQuery.data?.result
  const services = result?.data ?? []

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams()

    if (nextPage > 1) {
      nextParams.set('page', String(nextPage))
    }

    setSearchParams(nextParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(service: ServiceListItem) {
    const confirmed = window.confirm(`Delete "${typeof service.title === 'string' ? service.title : 'this service'}"?`)

    if (!confirmed) {
      return
    }

    await deleteServiceMutation.mutateAsync(service.id)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Provider workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">My services</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/account/provider/availability">Manage availability</Link>
          </Button>
          <Button asChild>
            <Link to="/account/provider/services/new">Add new service</Link>
          </Button>
        </div>
      </section>

      {myServicesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden pt-0">
              <div className="aspect-[4/3] animate-pulse bg-muted" />
              <CardHeader className="space-y-2">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!myServicesQuery.isLoading && myServicesQuery.isError ? (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(myServicesQuery.error, 'Unable to load your services right now.')}
          </CardContent>
        </Card>
      ) : null}

      {!myServicesQuery.isLoading && !myServicesQuery.isError ? (
        <section className="space-y-6">
          {services.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <ProviderServiceCard key={service.id} service={service} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                You do not have any services yet.
              </CardContent>
            </Card>
          )}

          <PaginationControls
            currentPage={result?.current_page ?? 1}
            lastPage={result?.last_page ?? 1}
            onPageChange={handlePageChange}
          />
        </section>
      ) : null}
    </div>
  )
}
