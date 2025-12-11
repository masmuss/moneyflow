import type { PageServerLoad } from './$types';
import { getPresetPeriods, getReportData } from '$lib/features/reports/reports.server';
import { getCurrentUserId } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url }) => {
	const userId = getCurrentUserId();
	const presetValue = url.searchParams.get('period') || 'this-month';
	const presets = getPresetPeriods();

	const selectedPreset = presets.find((p) => p.value === presetValue) || presets[0];
	const reportData = await getReportData(userId, selectedPreset.period);

	return {
		presets,
		selectedPreset: presetValue,
		...reportData
	};
};
