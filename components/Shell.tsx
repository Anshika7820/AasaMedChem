import { Navbar } from "./Navbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  );
}
