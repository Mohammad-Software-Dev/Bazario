import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { CartLineItem } from '@/features/cart/components/cart-line-item'
import { CartSummary } from '@/features/cart/components/cart-summary'
import { useCartActions, useCartItems, useCartSummary } from '@/features/cart/hooks/use-cart'
import { useCheckoutMutation } from '@/features/orders/hooks/use-checkout-mutation'
import { useAuth } from '@/lib/auth/use-auth'
import { getApiErrorMessage } from '@/lib/api/api-error'
import { useUiStore } from '@/stores/ui-store'

export function CartPage() {
  const items = useCartItems()
  const summary = useCartSummary()
  const { clearCart, removeItem, updateProductQuantity } = useCartActions()
  const checkoutMutation = useCheckoutMutation()
  const { isAuthenticated } = useAuth()
  const openLoginDialog = useUiStore((state) => state.openLoginDialog)

  function handleCheckout() {
    if (!isAuthenticated) {
      openLoginDialog()
      return
    }

    checkoutMutation.mutate(items)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:py-12">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Shopping cart</p>
        <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">Your cart</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="space-y-4">
          {items.length ? (
            items.map((item) => (
              <CartLineItem
                key={item.cart_item_id}
                item={item}
                onRemove={removeItem}
                onQuantityChange={updateProductQuantity}
              />
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your cart is empty</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Add products or service bookings to start building your order.
              </CardContent>
            </Card>
          )}

          {checkoutMutation.isError ? (
            <Card>
              <CardContent className="py-4 text-sm text-destructive">
                {getApiErrorMessage(checkoutMutation.error, 'Unable to start checkout right now.')}
              </CardContent>
            </Card>
          ) : null}
        </section>

        <aside>
          <CartSummary
            onCheckout={handleCheckout}
            onClear={clearCart}
            summary={summary}
            isCheckoutPending={checkoutMutation.isPending}
          />
        </aside>
      </div>
    </div>
  )
}
