"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { createOrder, createQuotation, removeCartItem } from "@/lib/store";
import { money } from "@/lib/conversion";
import { useAppState } from "@/lib/useAppState";

export default function CartPage() {
  const { state, user } = useAppState();
  const items = state?.cart ?? [];
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const order = () => {
    if (!user) return;
    try {
      createOrder(user.id);
      alert("Order placed successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not place order");
    }
  };

  const quote = () => {
    if (!user) return;
    try {
      createQuotation(user.id);
      alert("Quotation requested successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not request quotation");
    }
  };

  return (
    <Protected role="USER">
      <Shell>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black">Cart</h1>
          <Link href="/products"><Button variant="secondary">Add Products</Button></Link>
        </div>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Product</th><th>Entered</th><th>Converted</th><th>Amount</th><th></th></tr></thead>
              <tbody>
                {items.map((item) => {
                  const product = state?.products.find((candidate) => candidate.id === item.productId);
                  return <tr className="border-t border-line" key={item.id}><td className="p-3 font-bold">{product?.name}</td><td>{item.quantityEntered} {item.unitEntered}</td><td>{item.convertedQuantity} {product?.baseUnit}</td><td>{money(item.amount)}</td><td><Button variant="danger" onClick={() => removeCartItem(item.id)}>Remove</Button></td></tr>;
                })}
              </tbody>
            </table>
          </div>
          {!items.length ? <p className="py-8 text-center text-slate-500">Cart is empty.</p> : null}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <p className="text-xl font-black">Total: {money(total)}</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={quote} disabled={!items.length}>Request Quotation</Button>
              <Button onClick={order} disabled={!items.length}>Place Order</Button>
            </div>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
