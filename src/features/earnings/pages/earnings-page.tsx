import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceList } from "@/features/earnings/components/balance-list";
import { TransferList } from "@/features/earnings/components/transfer-list";
import { useConnectSummaryQuery } from "@/features/connect/hooks/use-connect-summary-query";
import type { ConnectRoleEarningsSummary } from "@/features/connect/types/connect.types";
import { getApiErrorMessage } from "@/lib/api/api-error";

function formatEligibleType(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return value.replace(/_/g, " ");
}

interface RoleEarningsSectionProps {
  title: string;
  pendingRows: ConnectRoleEarningsSummary["platform_pending_balance"];
  transfers: ConnectRoleEarningsSummary["transfers"];
  noPendingLabel: string;
}

function RoleEarningsSection({
  title,
  pendingRows,
  transfers,
  noPendingLabel,
}: RoleEarningsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("earnings.platformPending")}
          </p>
          <BalanceList emptyLabel={noPendingLabel} rows={pendingRows} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("earnings.recentTransfers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferList transfers={transfers} />
        </CardContent>
      </Card>
    </div>
  );
}

export function EarningsPage() {
  const { t } = useTranslation();
  const connectSummaryQuery = useConnectSummaryQuery();

  if (connectSummaryQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {t("earnings.loading")}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (connectSummaryQuery.isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            {getApiErrorMessage(
              connectSummaryQuery.error,
              t("provider.loadEarningsError"),
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = connectSummaryQuery.data;

  if (!summary) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("earnings.workspace")}</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            {t("earnings.title")}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account">{t("common.backToAccount")}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("earnings.readiness")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">{t("earnings.eligibleType")}</p>
            <p className="mt-1 font-medium capitalize text-foreground">
              {formatEligibleType(summary.eligible_type, t("earnings.notAvailable"))}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">{t("earnings.connected")}</p>
            <p className="mt-1 font-medium text-foreground">
              {summary.connected ? t("common.yes") : t("common.no")}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">{t("earnings.payoutsEnabled")}</p>
            <p className="mt-1 font-medium text-foreground">
              {summary.account?.payouts_enabled ? t("common.yes") : t("common.no")}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">{t("earnings.stripeAccount")}</p>
            <p className="mt-1 break-all font-medium text-foreground">
              {summary.account?.stripe_account_id ?? t("earnings.notConnected")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("earnings.stripeAvailable")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel={t("earnings.noStripeAvailable")}
              rows={summary.stripe_balance.available}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("earnings.stripePending")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel={t("earnings.noStripePending")}
              rows={summary.stripe_balance.pending}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("earnings.platformPendingTotal")}</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel={t("earnings.noPlatformPending")}
              rows={summary.platform_pending_balance}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          {t("earnings.sharedStripeHint")}
        </CardContent>
      </Card>

      <RoleEarningsSection
        title={t("earnings.sellerSection")}
        pendingRows={summary.earnings_by_role.seller.platform_pending_balance}
        transfers={summary.earnings_by_role.seller.transfers}
        noPendingLabel={t("earnings.noSellerPending")}
      />

      <RoleEarningsSection
        title={t("earnings.providerSection")}
        pendingRows={summary.earnings_by_role.service_provider.platform_pending_balance}
        transfers={summary.earnings_by_role.service_provider.transfers}
        noPendingLabel={t("earnings.noProviderPending")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("earnings.allTransfers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferList transfers={summary.transfers} />
        </CardContent>
      </Card>

      {!summary.connected ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
            <p>{t("earnings.connectHint")}</p>
            <Button asChild>
              <Link to="/account/stripe">{t("earnings.goToStripe")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
