import { Link, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function parseOrderId(value: string | null) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export function CheckoutCancelPage() {
  const [searchParams] = useSearchParams()
  const orderId = parseOrderId(searchParams.get('order_id'))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Checkout</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Checkout cancelled</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment was not completed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            Your Stripe checkout session was cancelled before payment was confirmed. Your cart is still available.
          </p>

          {orderId ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Order:</span> #{orderId}
              </p>
              <p>You can return to the cart and try checkout again.</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/cart">Back to cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/account/orders">View my orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
