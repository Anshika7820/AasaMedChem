"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import { register } from "@/lib/store";
import type { Role } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("SELLER");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user = register(name, email, password, role);
      window.dispatchEvent(new Event("aasamedchem-state"));
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-70px)] max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <h1 className="text-2xl font-black">Register Account</h1>
          <p className="mt-2 text-sm text-slate-600">Choose a role for the demo account. Admin opens the admin panel, Seller and User open the shopping flow.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-semibold">Name
              <input className="mt-1 w-full rounded-md border border-line px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">Email
              <input className="mt-1 w-full rounded-md border border-line px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">Password
              <input className="mt-1 w-full rounded-md border border-line px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">Role
              <select className="mt-1 w-full rounded-md border border-line bg-white px-3 py-2" value={role} onChange={(event) => setRole(event.target.value as Role)}>
                <option value="ADMIN">Admin</option>
                <option value="SELLER">Seller</option>
                <option value="USER">User</option>
              </select>
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full">Create Account</Button>
          </form>
          <p className="mt-4 text-sm">Already have an account? <Link className="font-bold text-brand" href="/login">Login</Link></p>
        </Card>
      </main>
    </>
  );
}
