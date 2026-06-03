"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { money } from "@/lib/conversion";
import { softDeleteProduct, upsertProduct } from "@/lib/store";
import type { BaseUnit } from "@/lib/conversion";
import type { Product } from "@/lib/types";
import { useAppState } from "@/lib/useAppState";

const emptyForm = {
  id: "",
  name: "",
  sku: "",
  description: "",
  categoryId: "",
  baseUnit: "g" as BaseUnit,
  stockQuantity: 0,
  pricePerBaseUnit: 0
};

export default function AdminProductsPage() {
  const { state } = useAppState();
  const [form, setForm] = useState(emptyForm);
  const products = state?.products.filter((product) => !product.isDeleted) ?? [];

  const edit = (product: Product) => setForm({
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    categoryId: product.categoryId,
    baseUnit: product.baseUnit,
    stockQuantity: product.stockQuantity,
    pricePerBaseUnit: product.pricePerBaseUnit
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    upsertProduct({
      id: form.id || undefined,
      name: form.name,
      sku: form.sku,
      description: form.description,
      categoryId: form.categoryId || state?.categories[0]?.id || "",
      baseUnit: form.baseUnit,
      stockQuantity: Number(form.stockQuantity),
      pricePerBaseUnit: Number(form.pricePerBaseUnit)
    });
    setForm(emptyForm);
  };

  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Product Management</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[390px_1fr]">
          <form className="rounded-lg border border-line bg-white p-5" onSubmit={submit}>
            <h2 className="text-xl font-bold">{form.id ? "Edit Product" : "Add Product"}</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-md border border-line px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="w-full rounded-md border border-line px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              <textarea className="min-h-24 w-full rounded-md border border-line px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="w-full rounded-md border border-line px-3 py-2" value={form.categoryId || state?.categories[0]?.id} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {state?.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <select className="w-full rounded-md border border-line px-3 py-2" value={form.baseUnit} onChange={(e) => setForm({ ...form, baseUnit: e.target.value as BaseUnit })}>
                <option value="g">g - weight base</option>
                <option value="mL">mL - volume base</option>
                <option value="item">item - count base</option>
              </select>
              <input className="w-full rounded-md border border-line px-3 py-2" min="0" step="0.0000000001" type="number" placeholder="Stock quantity" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} />
              <input className="w-full rounded-md border border-line px-3 py-2" min="0" step="0.0000000001" type="number" placeholder="Price per base unit" value={form.pricePerBaseUnit} onChange={(e) => setForm({ ...form, pricePerBaseUnit: Number(e.target.value) })} />
              <div className="flex gap-2">
                <Button>{form.id ? "Save Changes" : "Add Product"}</Button>
                {form.id ? <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}>Cancel</Button> : null}
              </div>
            </div>
          </form>
          <section className="rounded-lg border border-line bg-white p-5">
            <div className="table-wrap">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Product</th><th>SKU</th><th>Base</th><th>Stock</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>{products.map((product) => <tr className="border-t border-line" key={product.id}><td className="p-3 font-bold">{product.name}</td><td>{product.sku}</td><td>{product.baseUnit}</td><td>{product.stockQuantity}</td><td>{money(product.pricePerBaseUnit)}</td><td className="flex gap-2 py-2"><Button variant="secondary" onClick={() => edit(product)}>Edit</Button><Button variant="danger" onClick={() => softDeleteProduct(product.id)}>Delete</Button></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>
      </Shell>
    </Protected>
  );
}
