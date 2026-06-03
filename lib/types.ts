import type { BaseUnit, Unit } from "./conversion";

export type Role = "ADMIN" | "SELLER" | "USER";
export type OrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
export type QuotationStatus = "REQUESTED" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  baseUnit: BaseUnit;
  stockQuantity: number;
  pricePerBaseUnit: number;
  isDeleted: boolean;
  createdAt: string;
};

export type LineItem = {
  id: string;
  productId: string;
  quantityEntered: number;
  unitEntered: Unit;
  convertedQuantity: number;
  amount: number;
};

export type Order = {
  id: string;
  userId: string;
  items: LineItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

export type Quotation = {
  id: string;
  userId: string;
  items: LineItem[];
  totalAmount: number;
  status: QuotationStatus;
  createdAt: string;
};

export type AppState = {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  quotations: Quotation[];
  cart: LineItem[];
};
