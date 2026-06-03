"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { MetricCard } from "@/components/Card";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function DashboardPage() {
  const { state, user } = useAppState();
  const orders = state?.orders.filter((order) => order.userId === user?.id) ?? [];
  const quotations = state?.quotations.filter((quotation) => quotation.userId === user?.id) ?? [];

  return (
    <Protected role={["SELLER", "USER"]}>
      <Shell>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">Seller / User Dashboard</h1>
            <p className="mt-1 text-slate-600">Search products, calculate pricing, and place orders.</p>
          </div>
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Orders" value={orders.length} />
          <MetricCard label="Pending Orders" value={orders.filter((item) => item.status === "PENDING").length} />
          <MetricCard label="Quotations" value={quotations.length} />
          <MetricCard label="Cart Items" value={state?.cart.length ?? 0} />
        </div>
        <section className="mt-8 rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <div className="mt-4 table-wrap">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Order</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{orders.slice(0, 5).map((order) => <tr className="border-t border-line" key={order.id}><td className="p-3 font-semibold">{order.id}</td><td>{money(order.totalAmount)}</td><td><StatusBadge status={order.status} /></td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
