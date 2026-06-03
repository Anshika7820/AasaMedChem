"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAppState } from "@/lib/useAppState";
import type { Role } from "@/lib/types";

export function Protected({ children, role }: { children: React.ReactNode; role?: Role | Role[] }) {
  const router = useRouter();
  const { user } = useAppState();
  const allowedRoles = useMemo(() => (Array.isArray(role) ? role : role ? [role] : []), [role]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!user) router.push("/login");
      if (allowedRoles.length && user && !allowedRoles.includes(user.role)) {
        router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [router, user, allowedRoles]);

  if (!user) return <main className="mx-auto max-w-7xl px-4 py-10">Checking session...</main>;
  if (allowedRoles.length && !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
}
