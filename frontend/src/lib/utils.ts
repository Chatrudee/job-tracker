// src/lib/utils.ts
// utility function สำหรับ combine Tailwind classes
// ใช้คู่กับ shadcn/ui components

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
