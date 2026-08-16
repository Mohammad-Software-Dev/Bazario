import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime, formatMinorMoney, formatMoney } from '@/lib/i18n/format'
import { getApiErrorMessage } from '@/lib/api/api-error'

import { createListingCheckoutSession } from '@/features/listings/api/listings-api'
import { getListingImageUrl } from '@/features/listings/lib/listing-mappers'
import { ListingStatusBadge } from '@/features/listings/components/listing-status-badge'
import { useDeleteListingMutation } from '@/features/listings/hooks/use-delete-listing-mutation'
import type { ListingRecord } from '@/features/listings/types/listing.types'

interface MyListingCardProps {
  listing: ListingRecord
}

export function MyListingCard({ listing }: MyListingCardProps) {
  const { t, i18n } = useTranslation()
  const [isStartingCheckout, setIsStartingCheckout] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const deleteListingMutation = useDeleteListingMutation()
  const imageUrl = getListingImageUrl(listing)
  const price = typeof listing.price === 'number' ? listing.price : typeof listing.price === 'string' ? Number(listing.price) : null
  const currency = listing.currency_iso ?? 'EUR'
  const refundSummary = listing.refund?.applied ? listing.refund : null

  async function handleCompletePayment() {
    setCheckoutError(null)
    setIsStartingCheckout(true)

    try {
      const checkoutSession = await createListingCheckoutSession(listing.id)
      window.location.href = checkoutSession.checkout_url
    } catch (error) {
      setCheckoutError(getApiErrorMessage(error, t('listings.checkoutSessionError')))
      setIsStartingCheckout(false)
    }
  }

  async function handleDeleteListing() {
    setDeleteError(null)

    try {
      await deleteListingMutation.mutateAsync(listing.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, t('listings.deleteError')))
    }
  }

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
        <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-muted md:w-36">
          {imageUrl ? (
            <img src={imageUrl} alt={listing.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {t('common.noImage')}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{listing.title}</h3>
            <ListingStatusBadge status={listing.status} />
          </div>

          {listing.description ? (
            <p className="text-sm text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              {listing.description}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {price !== null && Number.isFinite(price) ? (
              <span>{formatMoney(price, currency, i18n.language)}</span>
            ) : null}
            <span>{t('listings.createdOn', { date: formatDateTime(listing.created_at, { dateStyle: 'medium' }) })}</span>
          </div>

          {listing.status === 'pending_payment' ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCompletePayment}
                  disabled={isStartingCheckout || deleteListingMutation.isPending}
                >
                  {isStartingCheckout ? t('listings.startingCheckout') : t('listings.completePayment')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isStartingCheckout || deleteListingMutation.isPending}
                >
                  {t('listings.deleteListing')}
                </Button>
              </div>
              {checkoutError ? <p className="text-sm text-destructive">{checkoutError}</p> : null}
              {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
            </div>
          ) : null}

          {refundSummary ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-sm text-rose-900">
              <p className="font-medium">{t('listings.refundTitle')}</p>
              <p>{t('listings.refundStatus', { status: refundSummary.status ?? t('orders.pending') })}</p>
              {refundSummary.amount !== null ? (
                <p>
                  {t('listings.refundAmount', {
                    amount: formatMinorMoney(refundSummary.amount, currency, i18n.language),
                  })}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t('listings.deleteTitle')}
        description={t('listings.deleteDescription')}
        confirmLabel={t('listings.deleteListing')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDeleteListing}
        isPending={deleteListingMutation.isPending}
        variant="destructive"
      />
    </Card>
  )
}
