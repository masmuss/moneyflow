// Default timezone for the application (Indonesia Western Time)
export const DEFAULT_TIMEZONE = 'Asia/Jakarta';

/**
 * Get current date in the application's timezone
 * This ensures consistent date handling regardless of server timezone
 */
export function getLocalDate(timezone: string = DEFAULT_TIMEZONE): Date {
	const now = new Date();
	// Get the date string in the target timezone
	const localDateStr = now.toLocaleDateString('en-CA', { timeZone: timezone });
	// Parse it back to a Date object (en-CA gives YYYY-MM-DD format)
	const [year, month, day] = localDateStr.split('-').map(Number);
	return new Date(year, month - 1, day);
}

/**
 * Convert Date to ISO date string (YYYY-MM-DD) in local timezone
 * Used for form inputs, database queries, and URL parameters
 * @example toDateString(new Date()) // "2024-12-13"
 */
export function toDateString(date: Date, timezone: string = DEFAULT_TIMEZONE): string {
	return date.toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Format date as "Month Year" (e.g., "December 2024")
 * Used for dashboard headers, report titles
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatMonthYear(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, {
		month: 'long',
		year: 'numeric',
		timeZone: DEFAULT_TIMEZONE
	});
}

/**
 * Format date as short month (e.g., "Dec")
 * Used for chart labels
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatShortMonth(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, {
		month: 'short',
		timeZone: DEFAULT_TIMEZONE
	});
}

/**
 * Format date as short date (e.g., "13 Dec")
 * Used for transaction rows, activity feeds
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'id-ID')
 */
export function formatShortDate(date: Date, locale: string = 'id-ID'): string {
	return date.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'short',
		timeZone: DEFAULT_TIMEZONE
	});
}

/**
 * Format date range as "Jun - Dec 2024"
 * Used for report period labels
 */
export function formatDateRange(startDate: Date, endDate: Date, locale: string = 'en-US'): string {
	const startStr = startDate.toLocaleDateString(locale, {
		month: 'short',
		timeZone: DEFAULT_TIMEZONE
	});
	const endStr = endDate.toLocaleDateString(locale, {
		month: 'short',
		year: 'numeric',
		timeZone: DEFAULT_TIMEZONE
	});
	return `${startStr} - ${endStr}`;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD) in local timezone
 * Convenience function for common use case
 */
export function getTodayString(): string {
	return toDateString(new Date());
}

/**
 * Get current month range in local timezone
 * Returns first and last day of current month as YYYY-MM-DD strings
 */
export function getCurrentMonthRange(): { firstDay: string; lastDay: string } {
	const localDate = getLocalDate();
	const firstDayOfMonth = new Date(localDate.getFullYear(), localDate.getMonth(), 1);
	const lastDayOfMonth = new Date(localDate.getFullYear(), localDate.getMonth() + 1, 0);

	return {
		firstDay: toDateString(firstDayOfMonth),
		lastDay: toDateString(lastDayOfMonth)
	};
}

/**
 * Get month range for a specific date
 */
export function getMonthRange(date: Date): { firstDay: string; lastDay: string } {
	const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

	return {
		firstDay: toDateString(firstDayOfMonth),
		lastDay: toDateString(lastDayOfMonth)
	};
}
