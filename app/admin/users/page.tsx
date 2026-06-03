"use client";

import { Protected } from "@/components/Protected";
import { Shell } from "@/components/Shell";
import { useAppState } from "@/lib/useAppState";

export default function AdminUsersPage() {
  const { state } = useAppState();
  return (
    <Protected role="ADMIN">
      <Shell>
        <h1 className="text-3xl font-black">Users</h1>
        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="table-wrap">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
              <tbody>{state?.users.map((user) => <tr className="border-t border-line" key={user.id}><td className="p-3 font-bold">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </Shell>
    </Protected>
  );
}
