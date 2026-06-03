"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { getAllowedUnits, getUnitType, money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function ProductsPage() {
  const { state } = useAppState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [unit, setUnit] = useState("all");
  const [sort, setSort] = useState("newest");

  const products = useMemo(() => {
    let items = (state?.products ?? []).filter((product) => !product.isDeleted);
    if (search) {
      const query = search.toLowerCase();
      items = items.filter((product) => product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query));
    }
    if (category !== "all") items = items.filter((product) => product.categoryId === category);
    if (unit !== "all") items = items.filter((product) => getUnitType(product.baseUnit) === unit);
    if (sort === "price") items = [...items].sort((a, b) => a.pricePerBaseUnit - b.pricePerBaseUnit);
    if (sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [state, search, category, unit, sort]);

  return (
    <Protected role="USER">
      <Shell>
        <h1 className="text-3xl font-black">Products</h1>
        <div className="mt-5 grid gap-3 rounded-lg border border-line bg-white p-4 md:grid-cols-4">
          <input className="rounded-md border border-line px-3 py-2" placeholder="Search name or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="rounded-md border border-line px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {state?.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select className="rounded-md border border-line px-3 py-2" value={unit} onChange={(event) => setUnit(event.target.value)}>
            <option value="all">All unit types</option>
            <option>Weight</option>
            <option>Volume</option>
            <option>Count</option>
          </select>
          <select className="rounded-md border border-line px-3 py-2" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const categoryName = state?.categories.find((item) => item.id === product.categoryId)?.name;
            return (
              <Card key={product.id}>
                <p className="text-xs font-bold uppercase text-brand">{categoryName}</p>
                <h2 className="mt-2 text-xl font-black">{product.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-slate-500">Stock</p><p className="font-bold">{product.stockQuantity} {product.baseUnit}</p></div>
                  <div><p className="text-slate-500">Price</p><p className="font-bold">{money(product.pricePerBaseUnit)} / {product.baseUnit}</p></div>
                  <div><p className="text-slate-500">Units</p><p className="font-bold">{getAllowedUnits(product.baseUnit).join(", ")}</p></div>
                  <div><p className="text-slate-500">Type</p><p className="font-bold">{getUnitType(product.baseUnit)}</p></div>
                </div>
                <Link className="mt-5 block rounded-md bg-brand px-4 py-2 text-center text-sm font-bold text-white hover:bg-teal-800" href={`/products/${product.id}`}>View & Calculate</Link>
              </Card>
            );
          })}
        </div>
      </Shell>
    </Protected>
  );
}
