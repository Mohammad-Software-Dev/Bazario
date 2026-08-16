import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAssetUrl } from "@/lib/api/asset-url";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { formatDateTime, formatMoney } from "@/lib/i18n/format";

import { createAdCheckoutSession } from "@/features/ads/api/ads-api";
import { useDeleteAdMutation } from "@/features/ads/hooks/use-delete-ad-mutation";
import type { AdViewModel } from "@/features/ads/types/ad.types";

interface MyAdCardProps {
  ad: AdViewModel;
}

function statusTone(status: string) {
  switch (status) {
    case "pending_payment":
      return "bg-sky-100 text-sky-700";
    case "pending_review":
      return "bg-amber-100 text-amber-700";
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    case "expired":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function paymentTone(paymentState: AdViewModel["paymentState"]) {
  switch (paymentState) {
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "refunded":
      return "bg-sky-100 text-sky-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
}

export function MyAdCard({ ad }: MyAdCardProps) {
  const { t, i18n } = useTranslation();
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteAdMutation = useDeleteAdMutation();
  const imageUrl = buildAssetUrl(ad.image);
  const targetTypeLabel = ad.targetType
    ? t(`ads.targetType.${ad.targetType}`)
    : t("ads.targetUnavailable");
  const paymentLabel =
    ad.paymentState === "paid"
      ? t("ads.paymentPaid")
      : ad.paymentState === "refunded"
        ? t("ads.paymentRefunded")
        : t("ads.paymentRequired");

  async function handleCompletePayment() {
    setCheckoutError(null);
    setIsStartingCheckout(true);

    try {
      const checkoutSession = await createAdCheckoutSession(ad.id);
      window.location.href = checkoutSession.checkout_url;
    } catch (error) {
      setCheckoutError(
        getApiErrorMessage(error, t("ads.checkoutSessionError")),
      );
      setIsStartingCheckout(false);
    }
  }

  async function handleDeleteAd() {
    setDeleteError(null);

    try {
      await deleteAdMutation.mutateAsync(ad.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, t("ads.deleteError")));
    }
  }

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-start">
        <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted md:w-36">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={ad.title}
              loading="lazy"
              decoding="async"
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {t("common.noImage")}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{ad.title}</h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(ad.status)}`}
            >
              {t(`ads.status.${ad.status}`, { defaultValue: ad.status })}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${paymentTone(ad.paymentState)}`}
            >
              {paymentLabel}
            </span>
          </div>

          {ad.subtitle ? (
            <p className="text-sm leading-5 text-muted-foreground">
              {ad.subtitle}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>{targetTypeLabel}</span>
            {ad.targetTitle ? <span>{ad.targetTitle}</span> : null}
            {ad.expiresAt ? (
              <span>
                {t("ads.expiresOn", {
                  date: formatDateTime(ad.expiresAt, { dateStyle: "medium" }),
                })}
              </span>
            ) : null}
            {ad.createdAt ? (
              <span>
                {t("ads.createdOn", {
                  date: formatDateTime(ad.createdAt, { dateStyle: "medium" }),
                })}
              </span>
            ) : null}
            {ad.price !== null ? (
              <span>
                {t("ads.priceLabel", {
                  price: formatMoney(ad.price, ad.currency, i18n.language),
                })}
              </span>
            ) : null}
          </div>

          {ad.status === "pending_payment" ? (
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCompletePayment}
                  disabled={isStartingCheckout || deleteAdMutation.isPending}
                >
                  {isStartingCheckout
                    ? t("ads.startingPayment")
                    : t("ads.completePayment")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isStartingCheckout || deleteAdMutation.isPending}
                >
                  {t("ads.deleteAd")}
                </Button>
              </div>
              {checkoutError ? (
                <p className="text-sm text-destructive">{checkoutError}</p>
              ) : null}
              {deleteError ? (
                <p className="text-sm text-destructive">{deleteError}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t("ads.deleteTitle")}
        description={t("ads.deleteDescription")}
        confirmLabel={t("ads.deleteAd")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleDeleteAd}
        isPending={deleteAdMutation.isPending}
        variant="destructive"
      />
    </Card>
  );
}
