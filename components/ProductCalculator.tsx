"use client";

import { useMemo, useState } from "react";
import { Calculator, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/store";
import { calculatePrice, convertToBaseUnit, getAllowedUnits, money, type Unit } from "@/lib/conversion";
import type { Product } from "@/lib/types";
import { Button } from "./Button";

export function ProductCalculator({ product }: { product: Product }) {
  const units = getAllowedUnits(product.baseUnit);
  const [unit, setUnit] = useState<Unit>(units[0]);
  const [quantity, setQuantity] = useState(1);
  const converted = useMemo(() => convertToBaseUnit(Number(quantity || 0), unit), [quantity, unit]);
  const total = useMemo(() => calculatePrice(Number(quantity || 0), unit, product.pricePerBaseUnit), [quantity, unit, product.pricePerBaseUnit]);

  const add = () => {
    addToCart(product, Number(quantity), unit);
    alert("Added to cart");
  };

  return (
    <div className="rounded-lg border border-line bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Unit
          <select className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2" value={unit} onChange={(event) => setUnit(event.target.value as Unit)}>
            {units.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Quantity
          <input className="mt-1 w-full rounded-md border border-line px-3 py-2" min="0" step="0.01" type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase text-slate-500">Entered</p>
          <p className="font-bold">{quantity} {unit}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Converted</p>
          <p className="font-bold">{converted} {product.baseUnit}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Total</p>
          <p className="font-bold">{money(total)}</p>
        </div>
      </div>
      <Button className="mt-4 w-full" onClick={add} disabled={quantity <= 0 || converted > product.stockQuantity}>
        <ShoppingCart className="h-4 w-4" /> Add To Cart
      </Button>
      {converted > product.stockQuantity ? <p className="mt-2 text-sm text-red-600">Requested quantity is greater than available stock.</p> : null}
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Calculator className="h-4 w-4" /> Price = converted quantity x price per {product.baseUnit}
      </p>
    </div>
  );
}
