import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, details, originalPrice, discountPrice, categoryId, imageUrl, stock } = body;

  const product = await db.product.create({
    data: {
      name,
      slug: slugify(name),
      details,
      originalPrice,
      discountPrice,
      categoryId,
      imageUrl: imageUrl || null,
      stock: stock || 100,
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}
