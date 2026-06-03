import Link from "next/link";
import { ArrowRight, Boxes, FileText, Scale, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const features: Array<[string, string, LucideIcon]> = [
    ["Inventory", "Manage stock, price, categories, and inventory value.", Boxes],
    ["Orders", "Users can calculate price and place orders.", FileText],
    ["Conversion", "kg to g, L to mL, and item counting.", Scale],
    ["Roles", "Admin and user dashboards with protected access.", ShieldCheck]
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-line bg-white">
          <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-brand">Medchem inventory project</p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
                AasaMedChem Inventory & Order Management System
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                A complete admin and seller portal for chemical products, stock control, quotations, orders, and accurate unit conversion.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/login"><Button>Login <ArrowRight className="h-4 w-4" /></Button></Link>
                <Link href="/register"><Button variant="secondary">Create Seller Account</Button></Link>
              </div>
              <p className="mt-4 text-sm text-slate-500">Demo admin: admin@aasamedchem.com / admin123</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(([title, text, Icon]) => (
                <Card key={String(title)}>
                  <Icon className="h-7 w-7 text-brand" />
                  <h2 className="mt-4 text-lg font-bold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
