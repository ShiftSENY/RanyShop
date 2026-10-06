import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderKey } from "@/lib/utils";

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
