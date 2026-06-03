"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import { login } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@aasamedchem.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const user = login(email, password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }
    window.dispatchEvent(new Event("aasamedchem-state"));
    router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-70px)] max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <h1 className="text-2xl font-black">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Use admin or seller demo credentials.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-semibold">Email
              <input className="mt-1 w-full rounded-md border border-line px-3 py-2" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="block text-sm font-semibold">Password
              <input className="mt-1 w-full rounded-md border border-line px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full">Login</Button>
          </form>
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
            Seller demo: seller@test.com / seller123
          </div>
          <p className="mt-4 text-sm">No account? <Link className="font-bold text-brand" href="/register">Register</Link></p>
        </Card>
      </main>
    </>
  );
}
