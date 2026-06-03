"use client";

import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function OrdersPage() {
  const { state, user } = useAppState();
  const orders = state?.orders.filter((order) => order.userId === user?.id) ?? [];
  return (
    <Protected role="USER">
      <Shell>
        <h1 className="text-3xl font-black">My Orders</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Order</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{orders.map((order) => <tr className="border-t border-line" key={order.id}><td className="p-3 font-bold">{order.id}</td><td>{order.items.length}</td><td>{money(order.totalAmount)}</td><td><StatusBadge status={order.status} /></td><td>{new Date(order.createdAt).toLocaleString()}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
