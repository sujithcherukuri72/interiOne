import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn-standard class merger — for components dropped in from shadcn/ui registries. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
