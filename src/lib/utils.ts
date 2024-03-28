import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//px-2 py-2 basically we are mergerning both of them togather as p-2
export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}
