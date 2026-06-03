"use client";

import { Button } from "@/components/Button";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { money } from "@/lib/conversion";
import { updateQuotationStatus } from "@/lib/store";
import type { QuotationStatus } from "@/lib/types";
import { useAppState } from "@/lib/useAppState";

const statuses: QuotationStatus[] = ["APPROVED", "REJECTED"];

export default function AdminQuotationsPage() {
  const { state } = useAppState();
  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Quotations</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Quotation</th><th>Customer</th><th>Items</th><th>Details</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {state?.quotations.map((quotation) => {
                  const user = state.users.find((item) => item.id === quotation.userId);
                  return (
                    <tr className="border-t border-line align-top" key={quotation.id}>
                      <td className="p-3 font-bold">{quotation.id}</td>
                      <td>{user?.name}<br /><span className="text-slate-500">{user?.email}</span></td>
                      <td>{quotation.items.length}</td>
                      <td>{quotation.items.map((item) => {
                        const product = state.products.find((candidate) => candidate.id === item.productId);
                        return <div key={item.id}>{product?.name}: {item.quantityEntered} {item.unitEntered} = {item.convertedQuantity} {product?.baseUnit}</div>;
                      })}</td>
                      <td>{money(quotation.totalAmount)}</td>
                      <td><StatusBadge status={quotation.status} /></td>
                      <td><div className="flex flex-wrap gap-2">{statuses.map((status) => <Button key={status} variant="secondary" onClick={() => updateQuotationStatus(quotation.id, status)}>{status}</Button>)}</div></td>
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
