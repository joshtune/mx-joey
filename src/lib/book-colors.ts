const bookColors: Record<string, { bg: string; badge: string }> = {
	'Pearl of Great Price': { bg: 'background-color: oklch(0.75 0.1 80 / 0.15)', badge: 'background-color: oklch(0.75 0.1 80 / 0.2); color: oklch(0.75 0.1 80)' },
	Genesis: { bg: 'background-color: oklch(0.6 0.15 155 / 0.15)', badge: 'background-color: oklch(0.6 0.15 155 / 0.2); color: oklch(0.6 0.15 155)' },
	Exodus: { bg: 'background-color: oklch(0.6 0.2 25 / 0.15)', badge: 'background-color: oklch(0.6 0.2 25 / 0.2); color: oklch(0.6 0.2 25)' },
	'Exodus / Leviticus': { bg: 'background-color: oklch(0.6 0.2 25 / 0.15)', badge: 'background-color: oklch(0.6 0.2 25 / 0.2); color: oklch(0.6 0.2 25)' },
	'Leviticus / Numbers': { bg: 'background-color: oklch(0.65 0.15 55 / 0.15)', badge: 'background-color: oklch(0.65 0.15 55 / 0.2); color: oklch(0.65 0.15 55)' },
	Deuteronomy: { bg: 'background-color: oklch(0.7 0.12 85 / 0.15)', badge: 'background-color: oklch(0.7 0.12 85 / 0.2); color: oklch(0.7 0.12 85)' },
	Joshua: { bg: 'background-color: oklch(0.65 0.15 130 / 0.15)', badge: 'background-color: oklch(0.65 0.15 130 / 0.2); color: oklch(0.65 0.15 130)' },
	Judges: { bg: 'background-color: oklch(0.6 0.12 180 / 0.15)', badge: 'background-color: oklch(0.6 0.12 180 / 0.2); color: oklch(0.6 0.12 180)' },
	'Ruth / 1 Samuel': { bg: 'background-color: oklch(0.6 0.1 200 / 0.15)', badge: 'background-color: oklch(0.6 0.1 200 / 0.2); color: oklch(0.6 0.1 200)' },
	'1 Samuel': { bg: 'background-color: oklch(0.6 0.12 230 / 0.15)', badge: 'background-color: oklch(0.6 0.12 230 / 0.2); color: oklch(0.6 0.12 230)' },
	'1–2 Samuel': { bg: 'background-color: oklch(0.6 0.12 230 / 0.15)', badge: 'background-color: oklch(0.6 0.12 230 / 0.2); color: oklch(0.6 0.12 230)' },
	'1 Kings': { bg: 'background-color: oklch(0.55 0.12 250 / 0.15)', badge: 'background-color: oklch(0.55 0.12 250 / 0.2); color: oklch(0.55 0.12 250)' },
	'1 Kings / 2 Chronicles': { bg: 'background-color: oklch(0.55 0.12 250 / 0.15)', badge: 'background-color: oklch(0.55 0.12 250 / 0.2); color: oklch(0.55 0.12 250)' },
	'2 Kings': { bg: 'background-color: oklch(0.55 0.12 270 / 0.15)', badge: 'background-color: oklch(0.55 0.12 270 / 0.2); color: oklch(0.55 0.12 270)' },
	'Ezra / Nehemiah': { bg: 'background-color: oklch(0.6 0.15 290 / 0.15)', badge: 'background-color: oklch(0.6 0.15 290 / 0.2); color: oklch(0.6 0.15 290)' },
	Esther: { bg: 'background-color: oklch(0.6 0.18 310 / 0.15)', badge: 'background-color: oklch(0.6 0.18 310 / 0.2); color: oklch(0.6 0.18 310)' },
	Job: { bg: 'background-color: oklch(0.6 0.02 80 / 0.15)', badge: 'background-color: oklch(0.6 0.02 80 / 0.2); color: oklch(0.6 0.02 80)' },
	Psalms: { bg: 'background-color: oklch(0.6 0.18 15 / 0.15)', badge: 'background-color: oklch(0.6 0.18 15 / 0.2); color: oklch(0.6 0.18 15)' },
	'Proverbs / Ecclesiastes': { bg: 'background-color: oklch(0.7 0.1 80 / 0.15)', badge: 'background-color: oklch(0.7 0.1 80 / 0.2); color: oklch(0.7 0.1 80)' },
	Isaiah: { bg: 'background-color: oklch(0.55 0.12 250 / 0.15)', badge: 'background-color: oklch(0.55 0.12 250 / 0.2); color: oklch(0.55 0.12 250)' },
	'Jeremiah / Lamentations': { bg: 'background-color: oklch(0.55 0.02 260 / 0.15)', badge: 'background-color: oklch(0.55 0.02 260 / 0.2); color: oklch(0.55 0.02 260)' },
	Ezekiel: { bg: 'background-color: oklch(0.6 0.15 155 / 0.15)', badge: 'background-color: oklch(0.6 0.15 155 / 0.2); color: oklch(0.6 0.15 155)' },
	Daniel: { bg: 'background-color: oklch(0.65 0.15 55 / 0.15)', badge: 'background-color: oklch(0.65 0.15 55 / 0.2); color: oklch(0.65 0.15 55)' },
	'Hosea / Joel': { bg: 'background-color: oklch(0.6 0.12 180 / 0.15)', badge: 'background-color: oklch(0.6 0.12 180 / 0.2); color: oklch(0.6 0.12 180)' },
	'Minor Prophets': { bg: 'background-color: oklch(0.6 0.1 200 / 0.15)', badge: 'background-color: oklch(0.6 0.1 200 / 0.2); color: oklch(0.6 0.1 200)' },
	Conference: { bg: 'background-color: oklch(0.55 0.02 260 / 0.15)', badge: 'background-color: oklch(0.55 0.02 260 / 0.2); color: oklch(0.55 0.02 260)' },
	Christmas: { bg: 'background-color: oklch(0.6 0.2 25 / 0.15)', badge: 'background-color: oklch(0.6 0.2 25 / 0.2); color: oklch(0.6 0.2 25)' }
};

const defaultColors = { bg: 'background-color: oklch(0.55 0.02 260 / 0.15)', badge: 'background-color: oklch(0.55 0.02 260 / 0.2); color: oklch(0.55 0.02 260)' };

export function getBookColors(book: string) {
	return bookColors[book] ?? defaultColors;
}
