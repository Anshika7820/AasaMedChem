"use client";

import { calculatePrice, convertToBaseUnit, type Unit } from "./conversion";
import type { AppState, LineItem, Order, OrderStatus, Product, Quotation, QuotationStatus, Role, User } from "./types";

const stateKey = "aasamedchem-state-v1";
const sessionKey = "aasamedchem-session-v1";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const seedState: AppState = {
  users: [
    { id: "u-admin", name: "Admin", email: "admin@aasamedchem.com", password: "admin123", role: "ADMIN", createdAt: now() },
    { id: "u-seller", name: "Test Seller", email: "seller@test.com", password: "seller123", role: "SELLER", createdAt: now() },
    { id: "u-user", name: "Test User", email: "user@test.com", password: "user123", role: "USER", createdAt: now() }
  ],
  categories: [
    { id: "cat-chem", name: "Chemicals", description: "General chemical products" },
    { id: "cat-acid", name: "Acids", description: "Acid compounds and solutions" },
    { id: "cat-solv", name: "Solvents", description: "Laboratory solvents" },
    { id: "cat-reag", name: "Laboratory Reagents", description: "Research and testing reagents" },
    { id: "cat-eq", name: "Laboratory Equipment", description: "Reusable lab equipment" }
  ],
  products: [
    {
      id: "p-citric",
      name: "Citric Acid",
      sku: "CHEM-001",
      description: "High-purity citric acid for laboratory and industrial use.",
      categoryId: "cat-chem",
      baseUnit: "g",
      stockQuantity: 50000,
      pricePerBaseUnit: 0.8,
      isDeleted: false,
      createdAt: now()
    },
    {
      id: "p-ethanol",
      name: "Ethanol",
      sku: "SOLV-001",
      description: "Laboratory grade ethanol solvent.",
      categoryId: "cat-solv",
      baseUnit: "mL",
      stockQuantity: 100000,
      pricePerBaseUnit: 0.5,
      isDeleted: false,
      createdAt: now()
    },
    {
      id: "p-hcl",
      name: "Hydrochloric Acid",
      sku: "ACID-001",
      description: "Controlled concentration hydrochloric acid solution.",
      categoryId: "cat-acid",
      baseUnit: "mL",
      stockQuantity: 25000,
      pricePerBaseUnit: 1.2,
      isDeleted: false,
      createdAt: now()
    },
    {
      id: "p-beaker",
      name: "Glass Beaker",
      sku: "LAB-001",
      description: "Borosilicate laboratory beaker.",
      categoryId: "cat-eq",
      baseUnit: "item",
      stockQuantity: 100,
      pricePerBaseUnit: 50,
      isDeleted: false,
      createdAt: now()
    }
  ],
  orders: [],
  quotations: [],
  cart: []
};

export function loadState(): AppState {
  if (typeof window === "undefined") return seedState;
  const raw = localStorage.getItem(stateKey);
  if (!raw) {
    localStorage.setItem(stateKey, JSON.stringify(seedState));
    return seedState;
  }
  return JSON.parse(raw) as AppState;
}

export function saveState(state: AppState) {
  localStorage.setItem(stateKey, JSON.stringify(state));
  window.dispatchEvent(new Event("aasamedchem-state"));
}

export function resetState() {
  saveState(seedState);
  localStorage.removeItem(sessionKey);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const idValue = localStorage.getItem(sessionKey);
  if (!idValue) return null;
  return loadState().users.find((user) => user.id === idValue) ?? null;
}

export function login(email: string, password: string): User | null {
  const state = loadState();
  const user = state.users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) return null;
  localStorage.setItem(sessionKey, user.id);
  return user;
}

export function logout() {
  localStorage.removeItem(sessionKey);
}

export function register(name: string, email: string, password: string, role: Exclude<Role, "ADMIN">): User {
  const state = loadState();
  if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email already exists");
  }
  const user: User = { id: id("u"), name, email, password, role, createdAt: now() };
  state.users.push(user);
  saveState(state);
  localStorage.setItem(sessionKey, user.id);
  return user;
}

export function upsertProduct(product: Partial<Product> & Omit<Product, "id" | "createdAt" | "isDeleted"> & { id?: string }) {
  const state = loadState();
  if (product.id) {
    state.products = state.products.map((item) => (item.id === product.id ? { ...item, ...product } : item));
  } else {
    state.products.push({ ...product, id: id("p"), createdAt: now(), isDeleted: false });
  }
  saveState(state);
}

export function softDeleteProduct(productId: string) {
  const state = loadState();
  state.products = state.products.map((product) => (product.id === productId ? { ...product, isDeleted: true } : product));
  saveState(state);
}

export function createLineItem(product: Product, quantity: number, unit: Unit): LineItem {
  const convertedQuantity = convertToBaseUnit(quantity, unit);
  return {
    id: id("li"),
    productId: product.id,
    quantityEntered: quantity,
    unitEntered: unit,
    convertedQuantity,
    amount: calculatePrice(quantity, unit, product.pricePerBaseUnit)
  };
}

export function addToCart(product: Product, quantity: number, unit: Unit) {
  const state = loadState();
  state.cart.push(createLineItem(product, quantity, unit));
  saveState(state);
}

export function removeCartItem(lineItemId: string) {
  const state = loadState();
  state.cart = state.cart.filter((item) => item.id !== lineItemId);
  saveState(state);
}

export function createOrder(userId: string): Order {
  const state = loadState();
  if (!state.cart.length) throw new Error("Cart is empty");
  for (const item of state.cart) {
    const product = state.products.find((candidate) => candidate.id === item.productId);
    if (!product || product.stockQuantity < item.convertedQuantity) throw new Error("Insufficient stock for one or more products");
  }
  state.products = state.products.map((product) => {
    const cartItem = state.cart.find((item) => item.productId === product.id);
    return cartItem ? { ...product, stockQuantity: product.stockQuantity - cartItem.convertedQuantity } : product;
  });
  const order: Order = {
    id: id("ord"),
    userId,
    items: state.cart,
    totalAmount: state.cart.reduce((sum, item) => sum + item.amount, 0),
    status: "PENDING",
    createdAt: now()
  };
  state.orders.unshift(order);
  state.cart = [];
  saveState(state);
  return order;
}

export function createQuotation(userId: string): Quotation {
  const state = loadState();
  if (!state.cart.length) throw new Error("Cart is empty");
  const quotation: Quotation = {
    id: id("quo"),
    userId,
    items: state.cart,
    totalAmount: state.cart.reduce((sum, item) => sum + item.amount, 0),
    status: "REQUESTED",
    createdAt: now()
  };
  state.quotations.unshift(quotation);
  state.cart = [];
  saveState(state);
  return quotation;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const state = loadState();
  state.orders = state.orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  saveState(state);
}

export function updateQuotationStatus(quotationId: string, status: QuotationStatus) {
  const state = loadState();
  state.quotations = state.quotations.map((quotation) => (quotation.id === quotationId ? { ...quotation, status } : quotation));
  saveState(state);
}
