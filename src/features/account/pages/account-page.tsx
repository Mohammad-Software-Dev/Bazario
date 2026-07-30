import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteAccountDialog } from '@/features/account/components/delete-account-dialog'
import { useMeQuery } from '@/features/account/hooks/use-me-query'
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
}

function ActionLinkRow({ title, description, to }: ActionLinkRowProps) {
  return (
    <Link to={to} className="block rounded-xl px-3 py-3 transition-colors hover:bg-muted/50">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
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
            <span className="text-sm text-muted-foreground">{formatOrderDate(order.paid_at || order.placed_at)}</span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground">
            <p>Total: {formatOrderMoney(order.total_amount, order.currency_iso)}</p>
            <p>{order.items.length} item{order.items.length === 1 ? '' : 's'}</p>
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
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm">
      <p className="font-medium text-foreground">Sale item #{sale.id}</p>
      <p className="mt-1 text-muted-foreground">Status: {sale.status}</p>
      <p className="mt-1 text-muted-foreground">Net: {formatOrderMoney(sale.net_amount)}</p>
    </div>
  )
}

function ProviderBookingsSection({ bookings }: { bookings: RecentProviderBooking[] }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Recent provider bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.length ? (
          bookings.map((booking) => <ProviderBookingCard key={booking.id} booking={booking} />)
        ) : (
          <p className="text-sm text-muted-foreground">No recent provider bookings.</p>
        )}
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
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Account profile</p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">{user?.name ?? 'Account'}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/account/edit-profile">Edit profile</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)] xl:items-stretch">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="gap-4 border-b border-border/70 pb-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-1">
                  <CardTitle>Order history</CardTitle>
                  <CardDescription>Your product purchases and service orders.</CardDescription>
                </div>
                <div className="rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-700">
                    Total orders: <span className="font-semibold text-foreground">{counts?.orders ?? 0}</span>
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Recent orders</p>
                  <p className="text-sm text-muted-foreground">Open an order to review payment state, totals, and included items.</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/account/orders">View all</Link>
                </Button>
              </div>

              {recentOrders.length ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => <RecentOrderCard key={order.id} order={order} />)}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 text-sm text-muted-foreground">
                  No recent orders yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="h-full border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Account actions</CardTitle>
              <CardDescription>Quick access to the customer tools and settings you are likely to use.</CardDescription>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-6">
              <div className="space-y-2">
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

              {(user?.available_upgrades?.seller || user?.available_upgrades?.service_provider) ? (
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

              <div className="mt-auto space-y-3 border-t border-border/70 pt-6">
                <p className="font-medium text-destructive">Danger zone</p>
                <p className="text-sm text-muted-foreground">
                  Permanently disable this account. Historical orders and related records remain preserved.
                </p>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {isSeller ? (
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Recent sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {recentSales.length ? (
                recentSales.map((sale) => <RecentSaleCard key={sale.id} sale={sale} />)
              ) : (
                <p className="text-sm text-muted-foreground">No recent sales.</p>
              )}
            </CardContent>
          </Card>
        ) : null}

        {isServiceProvider ? <ProviderBookingsSection bookings={recentProviderBookings} /> : null}
      </div>

      <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </>
  )
}
