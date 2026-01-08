/**
 * Format date utilities for SSR-safe date formatting
 * Prevents hydration errors by ensuring consistent output between server and client
 */

/**
 * Format number with thousand separators
 * SSR-safe alternative to toLocaleString()
 */
export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format date to Vietnamese locale string
 * Safe for SSR - returns ISO string that will be hydrated on client
 */
export function formatDateVN(dateString: string | Date | undefined): string {
  if (!dateString) return "-";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "-";

    // Use Intl.DateTimeFormat which is more consistent across environments
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
}

/**
 * Format date with time to Vietnamese locale string
 * Safe for SSR
 */
export function formatDateTimeVN(
  dateString: string | Date | undefined
): string {
  if (!dateString) return "-";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
}

/**
 * Format date for display - client-side only hook
 * Use this with useState to avoid hydration errors
 */
export function useFormattedDate(
  dateString: string | Date | undefined,
  includeTime = false
): string {
  if (typeof window === "undefined") {
    // Server-side: return ISO or simple format
    if (!dateString) return "-";
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toISOString().split("T")[0];
  }

  // Client-side: use locale format
  return includeTime ? formatDateTimeVN(dateString) : formatDateVN(dateString);
}
