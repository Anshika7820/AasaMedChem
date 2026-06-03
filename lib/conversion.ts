export type Unit = "g" | "kg" | "mL" | "L" | "item";
export type BaseUnit = "g" | "mL" | "item";

export function convertToBaseUnit(value: number, unit: Unit): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Quantity must be a valid positive number");
  }

  switch (unit) {
    case "kg":
      return value * 1000;
    case "g":
      return value;
    case "L":
      return value * 1000;
    case "mL":
      return value;
    case "item":
      return value;
    default:
      throw new Error("Invalid unit");
  }
}

export function calculatePrice(quantity: number, unit: Unit, pricePerBaseUnit: number): number {
  return convertToBaseUnit(quantity, unit) * pricePerBaseUnit;
}

export function getAllowedUnits(baseUnit: BaseUnit): Unit[] {
  if (baseUnit === "g") return ["g", "kg"];
  if (baseUnit === "mL") return ["mL", "L"];
  return ["item"];
}

export function getUnitType(baseUnit: BaseUnit): "Weight" | "Volume" | "Count" {
  if (baseUnit === "g") return "Weight";
  if (baseUnit === "mL") return "Volume";
  return "Count";
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}
