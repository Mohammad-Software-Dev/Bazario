import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatCartMoney } from "@/features/cart/lib/cart-calculations";
import type { CartSummary as CartSummaryType } from "@/features/cart/types/cart.types";

interface CartSummaryProps {
  onClear: () => void;
  summary: CartSummaryType;
}

export function CartSummary({ onClear, summary }: CartSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Items</span>
          <span className="text-foreground">{summary.item_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Products</span>
          <span className="text-foreground">{summary.product_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Services</span>
          <span className="text-foreground">{summary.service_count}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <span className="font-medium text-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">
            {formatCartMoney(summary.subtotal)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <Button>Checkout</Button>
          <Button
            variant="outline"
            onClick={onClear}
            disabled={summary.item_count === 0}
          >
            Clear cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
