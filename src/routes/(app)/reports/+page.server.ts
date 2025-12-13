import type { PageServerLoad } from './$types';
import { getPresetPeriods, getReportData } from '$lib/features/reports/reports.server';
import { getUserIdFromRequest } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url, request }) => {
    const userId = await getUserIdFromRequest(request.headers);
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
