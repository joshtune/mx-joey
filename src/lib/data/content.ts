import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { GeneratedContent } from '$lib/types';

const CONTENT_DIR = resolve('data/content');

export function loadContent(weekNumber: number): GeneratedContent | null {
	const filePath = resolve(CONTENT_DIR, `week-${String(weekNumber).padStart(2, '0')}.json`);

	if (!existsSync(filePath)) {
		return null;
	}

	const raw = readFileSync(filePath, 'utf-8');
	return JSON.parse(raw) as GeneratedContent;
}
