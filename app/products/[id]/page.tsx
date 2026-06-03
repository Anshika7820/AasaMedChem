"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCalculator } from "@/components/ProductCalculator";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { state } = useAppState();
  const product = state?.products.find((item) => item.id === params.id && !item.isDeleted);
  const category = state?.categories.find((item) => item.id === product?.categoryId);

  return (
    <Protected role="USER">
      <Shell>
        {!product ? (
          <p>Product not found.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <section className="rounded-lg border border-line bg-white p-6">
              <Link className="text-sm font-bold text-brand" href="/products">Back to products</Link>
              <p className="mt-6 text-xs font-bold uppercase text-brand">{category?.name}</p>
              <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
              <p className="mt-2 text-slate-500">{product.sku}</p>
              <p className="mt-5 max-w-2xl leading-7 text-slate-600">{product.description}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">Stock</p><p className="text-xl font-bold">{product.stockQuantity} {product.baseUnit}</p></div>
                <div className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">Price</p><p className="text-xl font-bold">{money(product.pricePerBaseUnit)}</p></div>
                <div className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">Base Unit</p><p className="text-xl font-bold">{product.baseUnit}</p></div>
              </div>
            </section>
            <section className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-xl font-black">Quantity & Price</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Choose a supported unit. The system converts it to the product base unit and calculates the final amount instantly.</p>
              <div className="mt-5"><ProductCalculator product={product} /></div>
            </section>
          </div>
        )}
      </Shell>
    </Protected>
  );
}
