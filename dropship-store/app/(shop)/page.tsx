import { db } from "@/lib/db";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: any[] = [];
  let categories: any[] = [];
  try {
    categories = await db.category.findMany({ orderBy: { name: "asc" } });
    products = await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // Database not available
  }

  return (
    <HomePageClient initialProducts={products} initialCategories={categories} />
  );
}
