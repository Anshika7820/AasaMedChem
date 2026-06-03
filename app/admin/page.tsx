"use client";

import { MetricCard } from "@/components/Card";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function AdminPage() {
  const { state } = useAppState();
  const products = state?.products.filter((product) => !product.isDeleted) ?? [];
  const inventoryValue = products.reduce((sum, product) => sum + product.stockQuantity * product.pricePerBaseUnit, 0);
  const chartData = state?.categories.map((category) => ({
    name: category.name.replace("Laboratory ", "Lab "),
    value: products.filter((product) => product.categoryId === category.id).reduce((sum, product) => sum + product.stockQuantity * product.pricePerBaseUnit, 0)
  })) ?? [];
  const maxCategoryValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Manage products, inventory, orders, quotations, and users.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label="Products" value={products.length} />
          <MetricCard label="Orders" value={state?.orders.length ?? 0} />
          <MetricCard label="Pending Orders" value={state?.orders.filter((item) => item.status === "PENDING").length ?? 0} />
          <MetricCard label="Users" value={state?.users.length ?? 0} />
          <MetricCard label="Inventory Value" value={money(inventoryValue)} />
        </div>
        <section className="mt-8 rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-bold">Inventory Value By Category</h2>
          <div className="mt-5 space-y-4">
            {chartData.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-slate-600">{money(item.value)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-brand"
                    style={{ width: `${Math.max(4, (item.value / maxCategoryValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
