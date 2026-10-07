import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/shop/OrderStatusBadge";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/orders");
  }

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      where: { userId: (session.user as { id: string }).id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database not available
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track fulfillment progress and order milestones in real time.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-[#E5DFD7] max-w-md mx-auto p-8 shadow-sm">
          <span className="text-4xl mb-3 block">📦</span>
          <p className="text-lg font-bold text-[#23271A] mb-1">
            No orders placed yet
          </p>
          <p className="text-sm text-stone-500 mb-6">
            When you place an order, you can track its progress here.
          </p>
          <Link href="/">
            <Button className="w-full">Explore Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-[#E5DFD7] p-6 shadow-sm"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-4 border-b border-[#E5DFD7]/60">
                <div>
                  <h3 className="font-bold text-[#23271A] text-base">
                    Order <span className="font-mono text-[#47522D]">{order.orderKey}</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Ordered Items ({order.items.length})
                </h4>
                <div className="divide-y divide-[#E5DFD7]/50">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                      <span className="text-stone-700 font-medium">
                        {item.product.name} <span className="text-stone-400 text-xs font-normal">× {item.quantity}</span>
                      </span>
                      <span className="font-semibold text-[#23271A] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#E5DFD7]/60 mt-5 pt-4 flex flex-wrap justify-between items-center gap-4 bg-[#FAF7F2]/80 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <div className="text-xs text-stone-500 space-y-0.5">
                  <p>
                    Payment Method:{" "}
                    <span className="font-semibold text-[#23271A]">
                      {order.paymentMethod === "QR_CODE"
                        ? "QR Code"
                        : order.paymentMethod === "E_WALLET"
                          ? "E-Wallet"
                          : "Bank Transfer"}
                    </span>
                  </p>
                  <p>
                    Total Items:{" "}
                    <span className="font-semibold text-[#23271A] tabular-nums">
                      {order.totalQuantity}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">
                    Total Amount
                  </p>
                  <p className="text-lg font-extrabold text-emerald-700 tabular-nums">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
