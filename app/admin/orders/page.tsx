"use client";

import { Button } from "@/components/Button";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { money } from "@/lib/conversion";
import { updateOrderStatus } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { useAppState } from "@/lib/useAppState";

const statuses: OrderStatus[] = ["APPROVED", "REJECTED", "COMPLETED"];

export default function AdminOrdersPage() {
  const { state } = useAppState();
  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Orders</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Order</th><th>Customer</th><th>Items</th><th>Details</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {state?.orders.map((order) => {
                  const user = state.users.find((item) => item.id === order.userId);
                  return (
                    <tr className="border-t border-line align-top" key={order.id}>
                      <td className="p-3 font-bold">{order.id}</td>
                      <td>{user?.name}<br /><span className="text-slate-500">{user?.email}</span></td>
                      <td>{order.items.length}</td>
                      <td>{order.items.map((item) => {
                        const product = state.products.find((candidate) => candidate.id === item.productId);
                        return <div key={item.id}>{product?.name}: {item.quantityEntered} {item.unitEntered} = {item.convertedQuantity} {product?.baseUnit}</div>;
                      })}</td>
                      <td>{money(order.totalAmount)}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td><div className="flex flex-wrap gap-2">{statuses.map((status) => <Button key={status} variant="secondary" onClick={() => updateOrderStatus(order.id, status)}>{status}</Button>)}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
