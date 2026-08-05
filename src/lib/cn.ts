type ClassValue = string | number | null | undefined | false;

/** Join class names, dropping falsy values. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
