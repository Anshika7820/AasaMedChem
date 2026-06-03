"use client";

import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function InventoryPage() {
  const { state } = useAppState();
  const products = state?.products.filter((product) => !product.isDeleted) ?? [];
  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Inventory</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Price</th><th>Inventory Value</th></tr></thead>
              <tbody>{products.map((product) => <tr className="border-t border-line" key={product.id}><td className="p-3 font-bold">{product.name}</td><td>{product.sku}</td><td>{state?.categories.find((cat) => cat.id === product.categoryId)?.name}</td><td>{product.stockQuantity} {product.baseUnit}</td><td>{money(product.pricePerBaseUnit)} / {product.baseUnit}</td><td className="font-bold">{money(product.stockQuantity * product.pricePerBaseUnit)}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
