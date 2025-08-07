import { type ClassValue } from "clsx";

/**
 * Utility function to combine class names
 * This is a simplified version of the popular 'cn' utility
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.flat().filter(Boolean).join(" ").trim();
}
