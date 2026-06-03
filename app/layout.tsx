import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AasaMedChem Inventory System",
  description: "Inventory, quotation, and order management system for chemical products"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
