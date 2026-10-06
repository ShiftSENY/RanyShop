import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderKey } from "@/lib/utils";
import { sendOrderNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, paymentMethod, items, totalAmount, totalQuantity } = body;

    const order = await db.order.create({
      data: {
        orderKey: generateOrderKey(),
        userId: (session.user as { id: string }).id,
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: address,
        paymentMethod,
        totalAmount,
        totalQuantity,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Notify the store admin. Awaited (serverless may freeze
    // un-awaited work); the helper never throws, so a mail
    // failure cannot fail checkout.
    const fullOrder = await db.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: { select: { name: true } } } },
        user: { select: { email: true } },
      },
    });
    if (fullOrder) {
      await sendOrderNotification({
        orderKey: fullOrder.orderKey,
        createdAt: fullOrder.createdAt,
        shippingName: fullOrder.shippingName,
        shippingPhone: fullOrder.shippingPhone,
        shippingAddress: fullOrder.shippingAddress,
        paymentMethod: fullOrder.paymentMethod,
        totalQuantity: fullOrder.totalQuantity,
        totalAmount: fullOrder.totalAmount,
        buyerEmail: fullOrder.user.email,
        items: fullOrder.items.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          product: { name: item.product.name },
        })),
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as { id: string; role: string };

  const where = user.role === "ADMIN" ? {} : { userId: user.id };

  const orders = await db.order.findMany({
    where,
    include: {
      items: {
        include: { product: true },
      },
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
