import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: any = null;
  try {
    product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch {
    // Database not available
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#1a6f72] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-start bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
        {/* Image */}
        <div className="aspect-square border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <span className="text-6xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-500">
                Wellness &amp; Skincare
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#3AB7BA]/10 text-[#1a6f72]">
            {product.category.name}
          </span>

          <h1 className="mt-3.5 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-lg text-gray-400 line-through tabular-nums font-normal">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">
              {formatPrice(product.discountPrice)}
            </span>
          </div>

          <p className="mt-6 text-sm sm:text-base text-gray-600 leading-relaxed">
            {product.details}
          </p>
          
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.discountPrice,
              imageUrl: product.imageUrl,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </div>
  );
}
