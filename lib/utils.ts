import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format currency

export function formatCurrency(amount: number): string {
  return `S/ ${amount.toFixed(2)}`
}
