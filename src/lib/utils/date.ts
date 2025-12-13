/**
 * Convert Date to ISO date string (YYYY-MM-DD)
 * Used for form inputs, database queries, and URL parameters
 * @example toDateString(new Date()) // "2024-12-13"
 */
export function toDateString(date: Date): string {
	return date.toISOString().split('T')[0];
}

/**
 * Format date as "Month Year" (e.g., "December 2024")
 * Used for dashboard headers, report titles
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatMonthYear(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

/**
 * Format date as short month (e.g., "Dec")
 * Used for chart labels
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatShortMonth(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, { month: 'short' });
}

/**
 * Format date as short date (e.g., "13 Dec")
 * Used for transaction rows, activity feeds
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatShortDate(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

/**
 * Format date range as "Jun - Dec 2024"
 * Used for report period labels
 */
export function formatDateRange(startDate: Date, endDate: Date, locale: string = 'en-US'): string {
	const startStr = startDate.toLocaleDateString(locale, { month: 'short' });
	const endStr = endDate.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
	return `${startStr} - ${endStr}`;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * Convenience function for common use case
 */
export function getTodayString(): string {
	return toDateString(new Date());
}
