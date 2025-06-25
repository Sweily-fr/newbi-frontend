import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class names with Tailwind CSS classes
 * This utility helps merge Tailwind classes efficiently and resolves conflicts
 * @param {string[]} inputs - Class names to combine
 * @returns {string} - Combined class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
