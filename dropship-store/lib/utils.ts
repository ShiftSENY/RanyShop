export function cn(
  ...inputs: (
    | string
    | false
    | null
    | undefined
    | Record<string, boolean | undefined>
  )[]
): string {
  const result: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      result.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price);
}

export function generateOrderKey(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PAYMENT_CONFIRMATION":
      return "bg-amber-100 text-amber-900";
    case "READY_TO_SHIP":
      return "bg-yellow-100 text-yellow-900";
    case "FOR_SHIPPING":
      return "bg-[#565E37]/15 text-[#353E20]";
    case "TO_BE_DELIVERED":
      return "bg-[#B35E2B]/15 text-[#7A3D18]";
    case "RECEIVED":
      return "bg-emerald-100 text-emerald-900";
    case "CANCELLED":
      return "bg-stone-200 text-stone-700";
    case "REFUNDED":
      return "bg-orange-100 text-orange-900";
    default:
      return "bg-stone-100 text-stone-800";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "PAYMENT_CONFIRMATION":
      return "Payment Confirmation";
    case "READY_TO_SHIP":
      return "Ready to Ship";
    case "FOR_SHIPPING":
      return "For Shipping";
    case "TO_BE_DELIVERED":
      return "To Be Delivered";
    case "RECEIVED":
      return "Received";
    case "CANCELLED":
      return "Cancelled";
    case "REFUNDED":
      return "Refunded";
    default:
      return status;
  }
}
