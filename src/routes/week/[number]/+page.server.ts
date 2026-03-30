import { error } from '@sveltejs/kit';
import { getLesson } from '$lib/utils';
import { loadContent } from '$lib/data/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const weekNumber = parseInt(params.number, 10);

	if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
		error(404, 'Week not found');
	}

	const lesson = getLesson(weekNumber);
	if (!lesson) {
		error(404, 'Lesson not found');
	}

	const content = loadContent(weekNumber);

	return {
		lesson,
		content
	};
};
