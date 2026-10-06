"use client";

import { useState, useEffect } from "react";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderKey: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  totalQuantity: number;
  totalAmount: number;
  createdAt: string;
  user: { name: string | null; email: string };
  items: OrderItem[];
}

const statuses = [
  "READY_TO_SHIP",
  "FOR_SHIPPING",
  "TO_BE_DELIVERED",
  "RECEIVED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
  };

  const handleDelete = async (orderId: string, orderKey: string) => {
    if (
      !confirm(
        `Delete order ${orderKey}? This permanently removes the order and its items.`
      )
    )
      return;

    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });

    if (res.ok) {
      setOrders(orders.filter((o) => o.id !== orderId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer fulfillment, payment confirmations, and tracking milestones.
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
          Total orders: <span className="font-semibold text-gray-900">{orders.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-sm">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-12 text-center">
          <p className="text-red-500 text-sm">
            Failed to load orders. Please check your database connection.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th scope="col" className="px-6 py-4">Order ID & Date</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-center">Items</th>
                  <th scope="col" className="px-6 py-4 text-right">Total Amount</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  return (
                    <tr key={order.id} className="group hover:bg-gray-50/60 transition-colors">
                      <td colSpan={6} className="p-0">
                        {/* Summary Row */}
                        <div className="grid grid-cols-1 md:grid-cols-6 items-center px-6 py-4.5 gap-4">
                          {/* Order Key & Date */}
                          <div className="md:col-span-1">
                            <span className="font-semibold text-gray-900 block tracking-tight">
                              {order.orderKey}
                            </span>
                            <span className="text-xs text-gray-400 mt-1 block">
                              {new Date(order.createdAt).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {/* Customer */}
                          <div className="md:col-span-1">
                            <p className="font-medium text-gray-900 truncate">
                              {order.shippingName || order.user.name || "Customer"}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {order.user.email}
                            </p>
                          </div>

                          {/* Status Select */}
                          <div className="md:col-span-1">
                            <div className="relative inline-block w-full max-w-[150px]">
                              <select
                                aria-label="Order status"
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                                className={`w-full text-xs font-semibold pl-3 pr-7 py-1.5 rounded-full border cursor-pointer focus:ring-2 focus:ring-blue-500/40 focus:outline-none appearance-none transition-all duration-150 hover:shadow-xs active:scale-98 ${getStatusColor(
                                  order.status
                                )} border-black/5 shadow-2xs`}
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s} className="bg-white text-gray-900 font-medium">
                                    {getStatusLabel(s)}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none opacity-60">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Items count */}
                          <div className="md:col-span-1 text-left md:text-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200/50">
                              {order.totalQuantity} item{order.totalQuantity !== 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Total Amount */}
                          <div className="md:col-span-1 text-left md:text-right">
                            <span className="font-bold text-gray-900 text-sm tabular-nums block">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {order.paymentMethod === "QR_CODE" ? "QR Code" : order.paymentMethod === "E_WALLET" ? "E-Wallet" : "Bank Transfer"} (Paid)
                            </span>
                          </div>

                          {/* Toggle expand + delete buttons */}
                          <div className="md:col-span-1 text-left md:text-right">
                            <div className="flex items-center justify-start md:justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(order.id, order.orderKey)
                                }
                                title="Delete order"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer bg-red-50/80 text-red-700 border-red-200/80 hover:bg-red-600 hover:text-white hover:border-red-600"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            <button
                              type="button"
                              onClick={() => toggleExpand(order.id)}
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer ${
                                isExpanded
                                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/20"
                                  : "bg-blue-50/80 text-blue-700 border-blue-200/80 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                              }`}
                            >
                              <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                              <svg
                                className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded detail drawer / section */}
                        {isExpanded && (
                          <div className="bg-gray-50/90 border-t border-gray-100 px-8 py-6 text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Shipping Information */}
                              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                  Shipping & Contact Info
                                </h4>
                                <div className="space-y-1.5 text-gray-700">
                                  <p className="font-semibold text-gray-900">
                                    {order.shippingName}
                                  </p>
                                  <p className="text-sm font-mono text-gray-600">
                                    {order.shippingPhone}
                                  </p>
                                  <p className="text-sm text-gray-600 leading-relaxed pt-1 border-t border-gray-100">
                                    {order.shippingAddress}
                                  </p>
                                </div>
                              </div>

                              {/* Purchased Items Table */}
                              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                  Ordered Items
                                </h4>
                                <div className="divide-y divide-gray-100">
                                  {order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="py-2.5 flex items-center justify-between gap-4 text-sm"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900 truncate">
                                          {item.product.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          Qty: {item.quantity} × {formatPrice(item.price)}
                                        </p>
                                      </div>
                                      <span className="font-semibold text-gray-900 tabular-nums shrink-0">
                                        {formatPrice(item.price * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
