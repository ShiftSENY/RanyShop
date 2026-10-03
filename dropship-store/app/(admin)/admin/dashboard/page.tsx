import { db } from "@/lib/db";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; color: string; bg: string; bar: string }> = {
  READY_TO_SHIP: { label: "Ready to Ship", color: "text-yellow-800", bg: "bg-yellow-100", bar: "bg-yellow-400" },
  FOR_SHIPPING: { label: "For Shipping", color: "text-blue-800", bg: "bg-blue-100", bar: "bg-blue-500" },
  TO_BE_DELIVERED: { label: "To Be Delivered", color: "text-purple-800", bg: "bg-purple-100", bar: "bg-purple-500" },
  RECEIVED: { label: "Received", color: "text-green-800", bg: "bg-green-100", bar: "bg-green-500" },
};

const STATUS_ORDER = ["READY_TO_SHIP", "FOR_SHIPPING", "TO_BE_DELIVERED", "RECEIVED"];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  let totalProducts = 0;
  let totalOrders = 0;
  let totalRevenue = 0;
  let totalCategories = 0;
  let recentOrders: any[] = [];
  let statusCounts: Record<string, number> = {};
  let actionableOrders = 0;

  try {
    const [products, orders, revenue, recent, categories, statusGroups] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.order.aggregate({ _sum: { totalAmount: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      db.category.count(),
      db.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);
    totalProducts = products;
    totalOrders = orders;
    totalRevenue = revenue._sum.totalAmount || 0;
    recentOrders = recent;
    totalCategories = categories;

    for (const group of statusGroups) {
      statusCounts[group.status] = group._count.id;
    }
    actionableOrders =
      (statusCounts["READY_TO_SHIP"] || 0) +
      (statusCounts["FOR_SHIPPING"] || 0) +
      (statusCounts["TO_BE_DELIVERED"] || 0);
  } catch {
    // Database not available — page degrades gracefully
  }

  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      {/* ── Greeting + contextual summary ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalOrders > 0 ? (
            <>
              You have{" "}
              <span className="font-semibold text-gray-700">
                {actionableOrders} order{actionableOrders !== 1 ? "s" : ""}
              </span>{" "}
              awaiting fulfillment and{" "}
              <span className="font-semibold text-green-700">
                {formatPrice(totalRevenue)}
              </span>{" "}
              in total revenue.
            </>
          ) : (
            "Your store is set up and ready for its first order."
          )}
        </p>
      </div>

      {/* ── Revenue hero + supporting stats ── */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200/60 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          {/* Revenue — the star metric */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </p>
            <p className="text-4xl sm:text-5xl font-extrabold text-green-600 tabular-nums tracking-tight leading-none">
              {formatPrice(totalRevenue)}
            </p>
          </div>

          {/* Supporting counts — secondary, not competing */}
          <div className="flex items-center gap-8 sm:gap-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {totalOrders}
              </p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Orders
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {totalProducts}
              </p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Products
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" aria-hidden="true" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {totalCategories}
              </p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Pipeline ── */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200/60 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">
            Order Pipeline
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {totalOrders > 0 ? (
          <>
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 mb-4">
              {STATUS_ORDER.map((status) => {
                const count = statusCounts[status] || 0;
                if (count === 0) return null;
                const pct = (count / totalOrders) * 100;
                const meta = STATUS_META[status];
                return (
                  <div
                    key={status}
                    className={`${meta.bar} transition-all duration-500`}
                    style={{ width: `${pct}%`, minWidth: count > 0 ? "8px" : 0 }}
                    title={`${meta.label}: ${count}`}
                    role="img"
                    aria-label={`${meta.label}: ${count} orders, ${Math.round(pct)}%`}
                  />
                );
              })}
            </div>

            {/* Legend with counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUS_ORDER.map((status) => {
                const count = statusCounts[status] || 0;
                const meta = STATUS_META[status];
                return (
                  <div key={status} className="flex items-center gap-2.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${meta.bar} shrink-0`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 truncate">
                        {meta.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">
                        {count}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-gray-500">
              No orders in the pipeline yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Orders will appear here as customers place them.
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="group flex items-center gap-4 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200/60 p-5 transition-shadow"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Add Product</p>
            <p className="text-xs text-gray-400 mt-0.5">List a new item in your catalog</p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="group flex items-center gap-4 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200/60 p-5 transition-shadow"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Manage Orders</p>
            <p className="text-xs text-gray-400 mt-0.5">Fulfill, track, and update status</p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="group flex items-center gap-4 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200/60 p-5 transition-shadow"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Categories</p>
            <p className="text-xs text-gray-400 mt-0.5">Organize your product catalog</p>
          </div>
        </Link>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200/60">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 pb-8 pt-4 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-gray-500">
              Your first order is on its way
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Make sure your products are listed and share your store link to start receiving orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th scope="col" className="px-6 py-3.5">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {order.orderKey}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-[180px]">
                        {order.user.name || order.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 text-right tabular-nums">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-right text-xs tabular-nums">
                      {new Date(order.createdAt).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
