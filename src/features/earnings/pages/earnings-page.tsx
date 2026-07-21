import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceList } from "@/features/earnings/components/balance-list";
import { TransferList } from "@/features/earnings/components/transfer-list";
import { useConnectSummaryQuery } from "@/features/connect/hooks/use-connect-summary-query";
import { getApiErrorMessage } from "@/lib/api/api-error";

function formatEligibleType(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  return value.replace(/_/g, " ");
}

export function EarningsPage() {
  const connectSummaryQuery = useConnectSummaryQuery();

  if (connectSummaryQuery.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:py-12">
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Loading earnings...
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
              "Unable to load earnings right now.",
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
          <p className="text-sm text-muted-foreground">Account workspace</p>
          <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
            Earnings
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/account">Back to account</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account readiness</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">Eligible type</p>
            <p className="mt-1 font-medium capitalize text-foreground">
              {formatEligibleType(summary.eligible_type)}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">Connected</p>
            <p className="mt-1 font-medium text-foreground">
              {summary.connected ? "Yes" : "No"}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">Payouts enabled</p>
            <p className="mt-1 font-medium text-foreground">
              {summary.account?.payouts_enabled ? "Yes" : "No"}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">Stripe account</p>
            <p className="mt-1 break-all font-medium text-foreground">
              {summary.account?.stripe_account_id ?? "Not connected"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Stripe available balance</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel="No available Stripe balance yet."
              rows={summary.stripe_balance.available}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe pending balance</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel="No pending Stripe balance yet."
              rows={summary.stripe_balance.pending}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform pending balance</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceList
              emptyLabel="No platform-held pending balance right now."
              rows={summary.platform_pending_balance}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <TransferList transfers={summary.transfers} />
        </CardContent>
      </Card>

      {!summary.connected ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted-foreground">
            <p>
              Connect Stripe to complete payout setup and monitor your connected
              account status.
            </p>
            <Button asChild>
              <Link to="/account/stripe">Go to Stripe account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
