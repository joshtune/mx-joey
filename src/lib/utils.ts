import { schedule } from '$lib/data/schedule';
import type { Lesson } from '$lib/types';

export function getCurrentWeekNumber(): number {
	const today = new Date();
	const todayStr = today.toISOString().split('T')[0];

	for (const lesson of schedule) {
		if (todayStr >= lesson.dateStart && todayStr <= lesson.dateEnd) {
			return lesson.weekNumber;
		}
	}

	if (todayStr < schedule[0].dateStart) return 1;
	return schedule[schedule.length - 1].weekNumber;
}

export function getNextSundayWeekNumber(): number {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
	const nextSunday = new Date(today);
	nextSunday.setDate(today.getDate() + daysUntilSunday);
	const nextSundayStr = nextSunday.toISOString().split('T')[0];

	for (const lesson of schedule) {
		if (nextSundayStr >= lesson.dateStart && nextSundayStr <= lesson.dateEnd) {
			return lesson.weekNumber;
		}
	}

	return getCurrentWeekNumber();
}

export function getLesson(weekNumber: number): Lesson | undefined {
	return schedule.find((l) => l.weekNumber === weekNumber);
}

export function formatDateRange(dateStart: string, dateEnd: string): string {
	const start = new Date(dateStart + 'T00:00:00');
	const end = new Date(dateEnd + 'T00:00:00');
	const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
	const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
	const startDay = start.getDate();
	const endDay = end.getDate();

	if (startMonth === endMonth) {
		return `${startMonth} ${startDay}–${endDay}`;
	}
	return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}
