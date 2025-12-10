export function formatCurrency(amount: number | bigint, currencyCode: string = 'IDR') {
	const decimals = currencyCode === 'IDR' ? 0 : 2;
	const value = Number(amount) / (currencyCode === 'IDR' ? 1 : 100);

	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: currencyCode,
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value);
}

/**
 * Format number ke format IDR untuk display
 * @param value - Nilai dalam minor units (contoh: 10000 = Rp 10.000)
 * @returns String formatted (contoh: "10.000")
 */
export function formatIDRInput(value: number | string): string {
	const numValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
	if (isNaN(numValue) || numValue === 0) return '';

	return new Intl.NumberFormat('id-ID').format(numValue);
}

/**
 * Parse formatted IDR string ke number (minor units)
 * @param formatted - String formatted (contoh: "10.000" atau "Rp 10.000")
 * @returns Number dalam minor units (contoh: 10000)
 */
export function parseIDRInput(formatted: string): number {
	const cleaned = formatted.replace(/\D/g, '');
	return cleaned ? parseInt(cleaned) : 0;
}

/**
 * Format number ke format Rupiah untuk display
 * @param value - Nilai dalam minor units
 * @returns String formatted dengan prefix Rp (contoh: "Rp 10.000")
 */
export function formatIDR(value: number | bigint): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(Number(value));
}
