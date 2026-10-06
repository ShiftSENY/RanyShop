import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

interface OrderEmailItem {
  quantity: number;
  price: number;
  product: { name: string };
}

interface OrderEmailData {
  orderKey: string;
  createdAt: Date;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  totalQuantity: number;
  totalAmount: number;
  buyerEmail: string;
  items: OrderEmailItem[];
}

function paymentLabel(method: string): string {
  switch (method) {
    case "QR_CODE":
      return "QR Code";
    case "E_WALLET":
      return "E-Wallet";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    default:
      return method;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends a new-order notification to the store admin.
 * Never throws — callers must not fail checkout because email failed.
 */
export async function sendOrderNotification(
  order: OrderEmailData
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !adminEmail || !from) {
    console.warn(
      "Order email skipped: RESEND_API_KEY, ADMIN_EMAIL, or EMAIL_FROM is not set."
    );
    return;
  }

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.product.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatPrice(item.price))}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(formatPrice(item.price * item.quantity))}</td>
        </tr>`
    )
    .join("");

  const itemLines = order.items
    .map(
      (item) =>
        `- ${item.product.name} x${item.quantity} @ ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const subject = `New order ${order.orderKey} — ${formatPrice(order.totalAmount)}`;
  const text =
    `A new order was placed on RanyShop.\n\n` +
    `Order: ${order.orderKey}\n` +
    `Date: ${order.createdAt.toLocaleString()}\n` +
    `Buyer: ${order.shippingName} (${order.buyerEmail}, ${order.shippingPhone})\n` +
    `Ship to: ${order.shippingAddress}\n` +
    `Payment: ${paymentLabel(order.paymentMethod)}\n\n` +
    `Items:\n${itemLines}\n\n` +
    `Total quantity: ${order.totalQuantity}\n` +
    `Total amount: ${formatPrice(order.totalAmount)}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;">
      <h2>New order ${escapeHtml(order.orderKey)}</h2>
      <p>A new order was placed on RanyShop.</p>
      <table style="border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Date</td><td><strong>${escapeHtml(order.createdAt.toLocaleString())}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Buyer</td><td><strong>${escapeHtml(order.shippingName)}</strong> (${escapeHtml(order.buyerEmail)}, ${escapeHtml(order.shippingPhone)})</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Ship to</td><td>${escapeHtml(order.shippingAddress)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Payment</td><td><strong>${escapeHtml(paymentLabel(order.paymentMethod))}</strong></td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="text-align:left;color:#666;">
            <th style="padding:8px;border-bottom:2px solid #ddd;">Item</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:center;">Qty</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right;">Unit</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p><strong>Total quantity:</strong> ${order.totalQuantity}<br />
      <strong>Total amount:</strong> ${escapeHtml(formatPrice(order.totalAmount))}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: adminEmail,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Order email failed to send:", error);
      return;
    }
    console.log(`Order notification sent for ${order.orderKey}`);
  } catch (error) {
    console.error("Order email failed to send:", error);
  }
}
