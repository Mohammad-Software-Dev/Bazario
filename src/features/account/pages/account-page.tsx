import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteAccountDialog } from '@/features/account/components/delete-account-dialog'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
import { useConnectStatusQuery } from '@/features/connect/hooks/use-connect-status-query'
import { ProviderBookingCard } from '@/features/orders/components/provider-booking-card'
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge'
import { formatOrderDate, formatOrderMoney } from '@/features/orders/lib/order-format'
import type {
  RecentOrder,
  RecentProviderBooking,
  RecentSaleItem,
} from '@/features/account/types/account.types'
import { useAuth } from '@/lib/auth/use-auth'

interface ActionLinkRowProps {
  title: string
  description: string
  to: string
  badge?: React.ReactNode
}

interface OrderHistoryCardProps {
  orders: RecentOrder[]
  totalOrders: number
  compact?: boolean
}

interface BusinessActivityCardProps {
  isSeller: boolean
  isServiceProvider: boolean
  recentSales: RecentSaleItem[]
  recentProviderBookings: RecentProviderBooking[]
}

function ActionLinkRow({ title, description, to, badge }: ActionLinkRowProps) {
  return (
    <Link to={to} className="block rounded-xl px-3 py-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-foreground">{title}</p>
        {badge}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}

function PendingUpgradeRow({ title, description }: { title: string; description: string }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-foreground">{title}</p>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
          {t('account.applicationPending')}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StripeStatusBadge() {
  const { t } = useTranslation()
  const connectStatusQuery = useConnectStatusQuery(true)
  const status = connectStatusQuery.data

  if (!status) {
    return null
  }

  if (!status.connected) {
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        {t('account.stripeNotConnected')}
      </span>
    )
  }

  if (status.account?.payouts_enabled && status.account?.details_submitted) {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
        {t('account.stripeReady')}
      </span>
    )
  }

  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
      {t('account.stripeOnboarding')}
    </span>
  )
}

function RecentOrderCard({ order }: { order: RecentOrder }) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block rounded-2xl border border-border/70 bg-background px-4 py-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium text-foreground">{t('orders.orderLabel', { id: order.id })}</p>
            <span className="text-sm text-muted-foreground">
              {formatOrderDate(order.paid_at || order.placed_at)}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
            <p>{t('orders.total')}: {formatOrderMoney(order.total_amount, order.currency_iso)}</p>
            <p>{t('orders.itemCount', { count: order.items.length })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 self-start md:self-center">
          <OrderStatusBadge status={order.status} />
          <span className="text-sm font-medium text-foreground">{t('common.viewDetails')}</span>
        </div>
      </div>
    </Link>
  )
}

function RecentSaleCard({ sale }: { sale: RecentSaleItem }) {
  const { t } = useTranslation()
  const orderDate = sale.order?.paid_at ?? sale.order?.placed_at ?? sale.created_at ?? null

  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="line-clamp-2 font-medium text-foreground">{sale.title_snapshot || t('common.untitledProduct')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            {sale.order?.id ? <span>{t('account.orderReference', { id: sale.order.id })}</span> : null}
            {orderDate ? <span>{formatOrderDate(orderDate)}</span> : null}
            <span>{t('account.quantityShort', { count: sale.quantity })}</span>
          </div>
          {sale.order?.buyer?.name ? (
            <p className="text-muted-foreground">{t('account.customer', { name: sale.order.buyer.name })}</p>
          ) : null}
        </div>
        <p className="shrink-0 font-medium text-foreground">{formatOrderMoney(sale.net_amount)}</p>
      </div>
    </div>
  )
}

function OrderHistoryCard({ orders, totalOrders, compact = false }: OrderHistoryCardProps) {
  const { t } = useTranslation()
  const title = compact ? t('account.yourOrderHistory') : t('orders.orderHistory')
  const description = compact
    ? t('account.yourOrderHistoryDescription')
    : t('orders.orderHistoryDescription')

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="gap-4 border-b border-border/70 pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-700">
              {t('orders.totalOrders', { count: totalOrders })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{t('orders.recentOrders')}</p>
            <p className="text-sm text-muted-foreground">
              {t('orders.recentOrdersDescription')}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/account/orders">{t('common.viewAll')}</Link>
          </Button>
        </div>

        {orders.length ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <RecentOrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-6 text-sm text-muted-foreground">
            {t('orders.noRecentOrders')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BusinessActivityCard({
  isSeller,
  isServiceProvider,
  recentSales,
  recentProviderBookings,
}: BusinessActivityCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="gap-2 border-b border-border/70 pb-5">
        <CardTitle>{t('account.businessActivity')}</CardTitle>
        <CardDescription>
          {t('account.businessActivityDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {isServiceProvider ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t('account.recentCustomerBookings')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('account.recentCustomerBookingsDescription')}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/account/provider/bookings">{t('account.viewAllBookings')}</Link>
              </Button>
            </div>

            {recentProviderBookings.length ? (
              <div className="space-y-3">
                {recentProviderBookings.map((booking) => (
                  <ProviderBookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/80 p-6 text-sm text-muted-foreground">
                {t('account.noRecentCustomerBookings')}
              </div>
            )}
          </section>
        ) : null}

        {isSeller ? (
          <section className={isServiceProvider ? 'border-t border-border/70 pt-6' : 'space-y-4'}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{t('account.recentProductOrders')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('account.recentProductOrdersDescription')}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/account/earnings">{t('account.viewEarnings')}</Link>
              </Button>
            </div>

            {recentSales.length ? (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <RecentSaleCard key={sale.id} sale={sale} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/80 p-6 text-sm text-muted-foreground">
                {t('account.noRecentProductOrders')}
              </div>
            )}
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function AccountPage() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const meQuery = useMeQuery(true, 5)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const user = meQuery.data?.result.user ?? session?.user
  const roles = session?.roles ?? user?.roles ?? []
  const isSeller = roles.includes('seller')
  const isServiceProvider = roles.includes('service_provider')
  const sellerUpgradePending = user?.upgrade_requests?.seller === 'pending'
  const serviceProviderUpgradePending = user?.upgrade_requests?.service_provider === 'pending'
  const hasBusinessWorkspace = isSeller || isServiceProvider
  const counts = meQuery.data?.result.counts
  const recentOrders = meQuery.data?.result.recent_orders ?? []
  const recentSales = meQuery.data?.result.recent_sales ?? []
  const recentProviderBookings = meQuery.data?.result.recent_provider_bookings ?? []
  const stripeStatusBadge = hasBusinessWorkspace ? <StripeStatusBadge /> : null

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t('account.profile')}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {user?.name ?? t('common.account')}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/account/edit-profile">{t('account.editProfile')}</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] xl:items-start">
          <div className="space-y-6">
            {hasBusinessWorkspace ? (
              <BusinessActivityCard
                isSeller={isSeller}
                isServiceProvider={isServiceProvider}
                recentSales={recentSales}
                recentProviderBookings={recentProviderBookings}
              />
            ) : (
              <OrderHistoryCard
                orders={recentOrders}
                totalOrders={counts?.orders ?? 0}
              />
            )}

            {hasBusinessWorkspace && recentOrders.length ? (
              <OrderHistoryCard
                orders={recentOrders}
                totalOrders={counts?.orders ?? 0}
                compact
              />
            ) : null}
          </div>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>{t('account.accountActions')}</CardTitle>
              <CardDescription>
                {t('account.accountActionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {isSeller ? (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{t('account.sellerWorkspace')}</p>
                  <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                    <ActionLinkRow
                      title={t('account.manageProducts')}
                      description={t('account.manageProductsDescription')}
                      to="/account/seller/products"
                    />
                    <ActionLinkRow
                      title={t('ads.manageAds')}
                      description={t('ads.manageAdsDescription')}
                      to="/account/ads"
                    />
                    <ActionLinkRow
                      title={t('account.stripeAccount')}
                      description={t('account.stripeAccountDescription')}
                      to="/account/stripe"
                      badge={stripeStatusBadge}
                    />
                    <ActionLinkRow
                      title={t('account.earnings')}
                      description={t('account.earningsDescription')}
                      to="/account/earnings"
                    />
                  </div>
                </div>
              ) : null}

              {isServiceProvider ? (
                <div className={isSeller ? 'space-y-2 border-t border-border/70 pt-6' : 'space-y-2'}>
                  <p className="font-medium text-foreground">{t('account.providerWorkspace')}</p>
                  <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                    <ActionLinkRow
                      title={t('account.manageServices')}
                      description={t('account.manageServicesDescription')}
                      to="/account/provider/services"
                    />
                    <ActionLinkRow
                      title={t('account.manageAvailability')}
                      description={t('account.manageAvailabilityDescription')}
                      to="/account/provider/availability"
                    />
                    <ActionLinkRow
                      title={t('account.customerBookings')}
                      description={t('account.customerBookingsDescription')}
                      to="/account/provider/bookings"
                    />
                    <ActionLinkRow
                      title={t('ads.manageAds')}
                      description={t('ads.manageAdsDescription')}
                      to="/account/ads"
                    />
                    <ActionLinkRow
                      title={t('account.stripeAccount')}
                      description={t('account.stripeAccountDescription')}
                      to="/account/stripe"
                      badge={stripeStatusBadge}
                    />
                    <ActionLinkRow
                      title={t('account.earnings')}
                      description={t('account.earningsDescription')}
                      to="/account/earnings"
                    />
                  </div>
                </div>
              ) : null}

              <div className={hasBusinessWorkspace ? 'space-y-2 border-t border-border/70 pt-6' : 'space-y-2'}>
                <p className="font-medium text-foreground">{t('account.customerWorkspace')}</p>
                <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                  <ActionLinkRow
                    title={t('account.reviewOrderHistory')}
                    description={t('account.reviewOrderHistoryDescription')}
                    to="/account/orders"
                  />
                  <ActionLinkRow
                    title={t('account.trackServiceBookings')}
                    description={t('account.trackServiceBookingsDescription')}
                    to="/account/bookings"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-border/70 pt-6">
                <p className="font-medium text-foreground">{t('listings.workspaceTitle')}</p>
                <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                  <ActionLinkRow
                    title={t('listings.manageListings')}
                    description={t('listings.manageListingsDescription')}
                    to="/account/announcements"
                  />
                  <ActionLinkRow
                    title={t('listings.create')}
                    description={t('listings.createListingDescription')}
                    to="/account/announcements/new"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-border/70 pt-6">
                <p className="font-medium text-foreground">{t('account.security')}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link to="/account/change-password">{t('account.changePassword')}</Link>
                  </Button>
                </div>
              </div>

              {user?.available_upgrades?.seller || user?.available_upgrades?.service_provider || sellerUpgradePending || serviceProviderUpgradePending ? (
                <div className="space-y-3 border-t border-border/70 pt-6">
                  <p className="font-medium text-foreground">{t('account.upgradeOptions')}</p>
                  <div className="space-y-2 rounded-2xl border border-border/70 p-2">
                    {sellerUpgradePending ? (
                      <PendingUpgradeRow
                        title={t('account.upgradeSeller')}
                        description={t('account.upgradeSellerPendingDescription')}
                      />
                    ) : null}
                    {user?.available_upgrades?.seller ? (
                      <ActionLinkRow
                        title={t('account.upgradeSeller')}
                        description={t('account.upgradeSellerDescription')}
                        to="/account/upgrade/seller"
                      />
                    ) : null}
                    {serviceProviderUpgradePending ? (
                      <PendingUpgradeRow
                        title={t('account.upgradeProvider')}
                        description={t('account.upgradeProviderPendingDescription')}
                      />
                    ) : null}
                    {user?.available_upgrades?.service_provider ? (
                      <ActionLinkRow
                        title={t('account.upgradeProvider')}
                        description={t('account.upgradeProviderDescription')}
                        to="/account/upgrade/service-provider"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 border-t border-border/70 pt-6">
                <p className="font-medium text-destructive">{t('account.dangerZone')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('account.deleteAccountDescription')}
                </p>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  {t('account.deleteAccount')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </>
  )
}
