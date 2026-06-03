"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Boxes, LogOut, PackageSearch, ShoppingCart } from "lucide-react";
import { Button } from "./Button";
import { logout } from "@/lib/store";
import { useAppState } from "@/lib/useAppState";

export function Navbar() {
  const router = useRouter();
  const { user, state } = useAppState();
  const cartCount = state?.cart.length ?? 0;

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("aasamedchem-state"));
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="flex items-center gap-2 font-bold text-ink">
          <Boxes className="h-5 w-5 text-brand" />
          AasaMedChem
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {user?.role === "ADMIN" ? (
            <>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/admin/products">Products</Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/admin/inventory">Inventory</Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/admin/orders">Orders</Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/admin/quotations">Quotations</Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/admin/users">Users</Link>
            </>
          ) : user ? (
            <>
              <Link className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-brand" href="/products">
                <PackageSearch className="h-4 w-4" /> Products
              </Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/orders">Orders</Link>
              <Link className="px-3 py-2 text-sm font-medium hover:text-brand" href="/quotations">Quotations</Link>
              <Link className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-brand" href="/cart">
                <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
              </Link>
            </>
          ) : null}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login"><Button variant="secondary">Login</Button></Link>
            <Link href="/register"><Button>Register</Button></Link>
          </div>
        )}
      </div>
    </header>
  );
}
