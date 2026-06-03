import { clsx } from "clsx";

export function StatusBadge({ status }: { status: string }) {
  const color = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    REQUESTED: "bg-fuchsia-100 text-fuchsia-800"
  }[status] ?? "bg-slate-100 text-slate-700";

  return <span className={clsx("rounded-full px-2.5 py-1 text-xs font-bold", color)}>{status}</span>;
}
