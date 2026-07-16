import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMeQuery } from "@/features/account/hooks/use-me-query";
import { useAuth } from "@/lib/auth/use-auth";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export function AccountPage() {
  const { session } = useAuth();
  const meQuery = useMeQuery(true, 5);

  const user = meQuery.data?.result.user ?? session?.user;
  const roles = session?.roles ?? user?.roles ?? [];
  const isSeller = roles.includes("seller") || Boolean(user?.seller_profile);
  const isServiceProvider =
    roles.includes("service_provider") ||
    Boolean(user?.service_provider_profile);
  const counts = meQuery.data?.result.counts;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>
            <span className="font-medium">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">Roles:</span>{" "}
            {session?.roles.join(", ")}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Orders", counts?.orders ?? 0],
          ["Bookings", counts?.bookings ?? 0],
          ...(isSeller ? ([["Sales", counts?.sales ?? 0]] as const) : []),
          ...(isServiceProvider
            ? ([["Provider bookings", counts?.provider_bookings ?? 0]] as const)
            : []),
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade options</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {user?.available_upgrades?.seller ? (
            <Button asChild variant="outline">
              <Link to="/account/upgrade/seller">Upgrade to seller</Link>
            </Button>
          ) : null}
          {user?.available_upgrades?.service_provider ? (
            <Button asChild variant="outline">
              <Link to="/account/upgrade/service-provider">
                Upgrade to service provider
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {user?.seller_profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Seller application</CardTitle>
            <CardDescription>
              Current seller request status from the backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <span className="font-medium">Store:</span>{" "}
              {user.seller_profile.store_name}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {user.seller_profile.status}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {user?.service_provider_profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Service provider application</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {user.service_provider_profile.name}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {user.service_provider_profile.status}
            </p>
            {isServiceProvider ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link to="/account/provider/services">Manage services</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/account/provider/availability">
                    Manage availability
                  </Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meQuery.data?.result.recent_orders?.length ? (
            meQuery.data.result.recent_orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-muted-foreground">
                  {order.status} - {formatMoney(order.total_amount)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent orders.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meQuery.data?.result.recent_bookings?.length ? (
            meQuery.data.result.recent_bookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Booking #{booking.id}</p>
                <p className="text-muted-foreground">
                  {booking.status} - {booking.service.title}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent bookings.</p>
          )}
        </CardContent>
      </Card>

      {isSeller ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent sales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meQuery.data?.result.recent_sales?.length ? (
              meQuery.data.result.recent_sales.map((sale) => (
                <div key={sale.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">Sale item #{sale.id}</p>
                  <p className="text-muted-foreground">
                    {sale.status} - {formatMoney(sale.net_amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent sales.</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {isServiceProvider ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent provider bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meQuery.data?.result.recent_provider_bookings?.length ? (
              meQuery.data.result.recent_provider_bookings.map((booking) => (
                <div key={booking.id} className="rounded-lg border p-3 text-sm">
                  <p className="font-medium">Provider booking #{booking.id}</p>
                  <p className="text-muted-foreground">
                    {booking.status} - {booking.service.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent provider bookings.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
