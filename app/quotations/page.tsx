"use client";

import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { StatusBadge } from "@/components/StatusBadge";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function QuotationsPage() {
  const { state, user } = useAppState();
  const quotations = state?.quotations.filter((quotation) => quotation.userId === user?.id) ?? [];
  return (
    <Protected role="USER">
      <Shell>
        <h1 className="text-3xl font-black">My Quotations</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Quotation</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{quotations.map((quotation) => <tr className="border-t border-line" key={quotation.id}><td className="p-3 font-bold">{quotation.id}</td><td>{quotation.items.length}</td><td>{money(quotation.totalAmount)}</td><td><StatusBadge status={quotation.status} /></td><td>{new Date(quotation.createdAt).toLocaleString()}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
