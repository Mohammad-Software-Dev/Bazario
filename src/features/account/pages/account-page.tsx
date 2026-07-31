import { useState } from 'react'
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

function getStripeStatusBadge(status: ReturnType<typeof useConnectStatusQuery>['data']) {
  if (!status) {
    return null
  }

  if (!status.connected) {
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Not connected
      </span>
    )
  }

  if (status.account?.payouts_enabled && status.account?.details_submitted) {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
        Ready
      </span>
    )
  }

  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
      Onboarding
    </span>
  )
}

function RecentOrderCard({ order }: { order: RecentOrder }) {
  return (
    <Link
      to={`/account/orders/${order.id}`}
      className="block rounded-2xl border border-border/70 bg-background px-4 py-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium text-foreground">Order #{order.id}</p>
            <span className="text-sm text-muted-foreground">
              {formatOrderDate(order.paid_at || order.placed_at)}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
            <p>Total: {formatOrderMoney(order.total_amount, order.currency_iso)}</p>
            <p>
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 self-start md:self-center">
          <OrderStatusBadge status={order.status} />
          <span className="text-sm font-medium text-foreground">View details</span>
        </div>
      </div>
    </Link>
  )
}

function RecentSaleCard({ sale }: { sale: RecentSaleItem }) {
  const orderDate = sale.order?.paid_at ?? sale.order?.placed_at ?? sale.created_at ?? null

  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="line-clamp-2 font-medium text-foreground">{sale.title_snapshot || `Product order #${sale.id}`}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            {sale.order?.id ? <span>Order #{sale.order.id}</span> : null}
            {orderDate ? <span>{formatOrderDate(orderDate)}</span> : null}
            <span>Qty: {sale.quantity}</span>
          </div>
          {sale.order?.buyer?.name ? (
            <p className="text-muted-foreground">Customer: {sale.order.buyer.name}</p>
          ) : null}
        </div>
        <p className="shrink-0 font-medium text-foreground">{formatOrderMoney(sale.net_amount)}</p>
      </div>
    </div>
  )
}

function OrderHistoryCard({ orders, totalOrders, compact = false }: OrderHistoryCardProps) {
  const title = compact ? 'Your order history' : 'Order history'
  const description = compact
    ? 'Your own purchases and service orders.'
    : 'Your product purchases and service orders.'

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
              Total orders: <span className="font-semibold text-foreground">{totalOrders}</span>
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="font-medium text-foreground">Recent orders</p>
            <p className="text-sm text-muted-foreground">
              Open an order to review payment state, totals, and included items.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/account/orders">View all</Link>
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
            No recent orders yet.
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
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="gap-2 border-b border-border/70 pb-5">
        <CardTitle>Business activity</CardTitle>
        <CardDescription>
          Prioritize customer bookings and incoming product orders from your workspace.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {isServiceProvider ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Recent customer bookings</p>
                <p className="text-sm text-muted-foreground">
                  Review the latest service bookings and follow up on requests quickly.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/account/provider/bookings">View all bookings</Link>
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
                No recent customer bookings yet.
              </div>
            )}
          </section>
        ) : null}

        {isSeller ? (
          <section className={isServiceProvider ? 'border-t border-border/70 pt-6' : 'space-y-4'}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="font-medium text-foreground">Recent product orders</p>
                <p className="text-sm text-muted-foreground">
                  Track the latest product-side orders and sales activity.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/account/earnings">View earnings</Link>
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
                No recent product orders yet.
              </div>
            )}
          </section>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function AccountPage() {
  const { session } = useAuth()
  const meQuery = useMeQuery(true, 5)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const user = meQuery.data?.result.user ?? session?.user
  const roles = session?.roles ?? user?.roles ?? []
  const isSeller = roles.includes('seller') || Boolean(user?.seller_profile)
  const isServiceProvider =
    roles.includes('service_provider') || Boolean(user?.service_provider_profile)
  const hasBusinessWorkspace = isSeller || isServiceProvider
  const hasConnectWorkspace = hasBusinessWorkspace
  const connectStatusQuery = useConnectStatusQuery(hasConnectWorkspace)
  const stripeStatusBadge = getStripeStatusBadge(connectStatusQuery.data)
  const counts = meQuery.data?.result.counts
  const recentOrders = meQuery.data?.result.recent_orders ?? []
  const recentSales = meQuery.data?.result.recent_sales ?? []
  const recentProviderBookings = meQuery.data?.result.recent_provider_bookings ?? []

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Account profile
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {user?.name ?? 'Account'}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/account/edit-profile">Edit profile</Link>
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
              <CardTitle>Account actions</CardTitle>
              <CardDescription>
                Quick access to the tools and settings that match your account roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {isSeller ? (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">Seller workspace</p>
                  <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                    <ActionLinkRow
                      title="Manage products"
                      description="Create, update, and remove products from your seller catalog."
                      to="/account/seller/products"
                    />
                    <ActionLinkRow
                      title="Stripe account"
                      description="Connect or resume your Stripe onboarding setup."
                      to="/account/stripe"
                      badge={stripeStatusBadge}
                    />
                    <ActionLinkRow
                      title="Earnings"
                      description="Review balances, platform-held amounts, and recent transfers."
                      to="/account/earnings"
                    />
                  </div>
                </div>
              ) : null}

              {isServiceProvider ? (
                <div className={isSeller ? 'space-y-2 border-t border-border/70 pt-6' : 'space-y-2'}>
                  <p className="font-medium text-foreground">Provider workspace</p>
                  <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                    <ActionLinkRow
                      title="Manage services"
                      description="Create, update, and organize the services you offer."
                      to="/account/provider/services"
                    />
                    <ActionLinkRow
                      title="Manage availability"
                      description="Set working hours and time off for your booking schedule."
                      to="/account/provider/availability"
                    />
                    <ActionLinkRow
                      title="Customer bookings"
                      description="Review booking requests and manage upcoming appointments."
                      to="/account/provider/bookings"
                    />
                    <ActionLinkRow
                      title="Stripe account"
                      description="Connect or resume your Stripe onboarding setup."
                      to="/account/stripe"
                      badge={stripeStatusBadge}
                    />
                    <ActionLinkRow
                      title="Earnings"
                      description="Review balances, platform-held amounts, and recent transfers."
                      to="/account/earnings"
                    />
                  </div>
                </div>
              ) : null}

              <div className={hasBusinessWorkspace ? 'space-y-2 border-t border-border/70 pt-6' : 'space-y-2'}>
                <p className="font-medium text-foreground">Customer workspace</p>
                <div className="space-y-1 rounded-2xl border border-border/70 p-2">
                  <ActionLinkRow
                    title="Review order history"
                    description="See all orders, payment states, and purchase details."
                    to="/account/orders"
                  />
                  <ActionLinkRow
                    title="Track service bookings"
                    description="Manage service bookings, cancellations, and reschedules."
                    to="/account/bookings"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t border-border/70 pt-6">
                <p className="font-medium text-foreground">Security</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link to="/account/change-password">Change password</Link>
                  </Button>
                </div>
              </div>

              {user?.available_upgrades?.seller || user?.available_upgrades?.service_provider ? (
                <div className="space-y-3 border-t border-border/70 pt-6">
                  <p className="font-medium text-foreground">Upgrade options</p>
                  <div className="space-y-2 rounded-2xl border border-border/70 p-2">
                    {user?.available_upgrades?.seller ? (
                      <ActionLinkRow
                        title="Upgrade to seller"
                        description="Start managing products and seller-side tools."
                        to="/account/upgrade/seller"
                      />
                    ) : null}
                    {user?.available_upgrades?.service_provider ? (
                      <ActionLinkRow
                        title="Upgrade to service provider"
                        description="Offer services, availability, and bookings."
                        to="/account/upgrade/service-provider"
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 border-t border-border/70 pt-6">
                <p className="font-medium text-destructive">Danger zone</p>
                <p className="text-sm text-muted-foreground">
                  Permanently disable this account. Historical orders and related records remain
                  preserved.
                </p>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  Delete account
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
