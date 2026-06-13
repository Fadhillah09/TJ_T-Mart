/**
 * Format number with thousand separator
 * @param num - Number to format
 * @returns Formatted string with separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param length - Max length
 * @returns Truncated text
 */
export const truncate = (text: string, length: number = 50): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Get initials from name
 * @param name - Full name
 * @returns Initials
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Debounce function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * @param func - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Check if device is mobile
 * @returns Boolean
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * Get random item from array
 * @param array - Array to pick from
 * @returns Random item
 */
export const randomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Sleep function
 * @param ms - Milliseconds to sleep
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Validate email
 * @param email - Email to validate
 * @returns Boolean
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Generate unique ID
 * @returns Unique string ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Parse JWT token
 * @param token - JWT token
 * @returns Decoded payload
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Get time difference from now
 * @param date - Date to compare
 * @returns Human readable time difference
 */
export const getTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const time = new Date(date);
  const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

  return time.toLocaleDateString('id-ID');
};

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get contrast color for readability
 * @param hexColor - Hex color
 * @returns White or black hex color
 */
export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountPrice - Discounted price
 * @returns Percentage discount
 */
export const calculateDiscount = (originalPrice: number, discountPrice: number): number => {
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * Pluralize text
 * @param count - Count
 * @param singular - Singular form
 * @param plural - Plural form
 * @returns Pluralized text
 */
export const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

import { CartItem } from '@/types';

// Kelompokkan cart berdasarkan mart_id
export function groupCartByMart(
  items: CartItem[]
): Record<number, { martName: string; items: CartItem[] }> {
  return items.reduce((acc, item) => {
    if (!acc[item.mart_id]) {
      acc[item.mart_id] = {
        martName: item.mart_name,
        items: []
      };
    }
    acc[item.mart_id].items.push(item);
    return acc;
  }, {} as Record<number, { martName: string; items: CartItem[] }>);
}

// Hitung total order
export function calcOrderTotal(
  items  : CartItem[],
  type   : "delivery" | "takeaway",
  ongkir : number = 4000,
  layananFee: number = 1000
): { subtotal: number; ongkos: number; layanan: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const ongkos = type === 'delivery' ? ongkir : 0;
  const layanan = subtotal > 0 ? layananFee : 0;
  const total = subtotal + ongkos + layanan;
  return { subtotal, ongkos, layanan, total };
}

// Trim semua string field di object form
export function sanitizeForm<T extends Record<string, unknown>>(form: T): T {
  const sanitized = {} as Record<string, unknown>;
  for (const key in form) {
    if (Object.prototype.hasOwnProperty.call(form, key)) {
      const val = form[key];
      if (typeof val === 'string') {
        sanitized[key] = val.trim();
      } else {
        sanitized[key] = val;
      }
    }
  }
  return sanitized as T;
}
