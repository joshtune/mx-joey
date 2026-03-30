import { redirect } from '@sveltejs/kit';
import { getNextSundayWeekNumber } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const weekNumber = getNextSundayWeekNumber();
	redirect(302, `/week/${weekNumber}`);
};
