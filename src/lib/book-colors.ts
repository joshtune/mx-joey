const bookColors: Record<string, { bg: string; accent: string; badge: string }> = {
	'Pearl of Great Price': { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
	Genesis: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', accent: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
	Exodus: { bg: 'bg-red-50 dark:bg-red-950/30', accent: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
	'Exodus / Leviticus': { bg: 'bg-red-50 dark:bg-red-950/30', accent: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
	'Leviticus / Numbers': { bg: 'bg-orange-50 dark:bg-orange-950/30', accent: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
	Deuteronomy: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', accent: 'text-yellow-700 dark:text-yellow-400', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
	Joshua: { bg: 'bg-lime-50 dark:bg-lime-950/30', accent: 'text-lime-700 dark:text-lime-400', badge: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300' },
	Judges: { bg: 'bg-teal-50 dark:bg-teal-950/30', accent: 'text-teal-700 dark:text-teal-400', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
	'Ruth / 1 Samuel': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', accent: 'text-cyan-700 dark:text-cyan-400', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' },
	'1 Samuel': { bg: 'bg-sky-50 dark:bg-sky-950/30', accent: 'text-sky-700 dark:text-sky-400', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
	'1–2 Samuel': { bg: 'bg-sky-50 dark:bg-sky-950/30', accent: 'text-sky-700 dark:text-sky-400', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' },
	'1 Kings': { bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
	'1 Kings / 2 Chronicles': { bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
	'2 Kings': { bg: 'bg-indigo-50 dark:bg-indigo-950/30', accent: 'text-indigo-700 dark:text-indigo-400', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
	'Ezra / Nehemiah': { bg: 'bg-violet-50 dark:bg-violet-950/30', accent: 'text-violet-700 dark:text-violet-400', badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
	Esther: { bg: 'bg-purple-50 dark:bg-purple-950/30', accent: 'text-purple-700 dark:text-purple-400', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
	Job: { bg: 'bg-stone-50 dark:bg-stone-950/30', accent: 'text-stone-700 dark:text-stone-400', badge: 'bg-stone-100 text-stone-800 dark:bg-stone-900/40 dark:text-stone-300' },
	Psalms: { bg: 'bg-rose-50 dark:bg-rose-950/30', accent: 'text-rose-700 dark:text-rose-400', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
	'Proverbs / Ecclesiastes': { bg: 'bg-amber-50 dark:bg-amber-950/30', accent: 'text-amber-700 dark:text-amber-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
	Isaiah: { bg: 'bg-blue-50 dark:bg-blue-950/30', accent: 'text-blue-700 dark:text-blue-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
	'Jeremiah / Lamentations': { bg: 'bg-slate-50 dark:bg-slate-950/30', accent: 'text-slate-700 dark:text-slate-400', badge: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-300' },
	Ezekiel: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', accent: 'text-emerald-700 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
	Daniel: { bg: 'bg-orange-50 dark:bg-orange-950/30', accent: 'text-orange-700 dark:text-orange-400', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
	'Hosea / Joel': { bg: 'bg-teal-50 dark:bg-teal-950/30', accent: 'text-teal-700 dark:text-teal-400', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300' },
	'Minor Prophets': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', accent: 'text-cyan-700 dark:text-cyan-400', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' },
	Conference: { bg: 'bg-gray-50 dark:bg-gray-950/30', accent: 'text-gray-700 dark:text-gray-400', badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300' },
	Christmas: { bg: 'bg-red-50 dark:bg-red-950/30', accent: 'text-red-700 dark:text-red-400', badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' }
};

const defaultColors = { bg: 'bg-gray-50 dark:bg-gray-950/30', accent: 'text-gray-700 dark:text-gray-400', badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300' };

export function getBookColors(book: string) {
	return bookColors[book] ?? defaultColors;
}
