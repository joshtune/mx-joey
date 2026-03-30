const bookColors: Record<string, { bg: string; accent: string; badge: string }> = {
	'Pearl of Great Price': { bg: 'bg-amber-50', accent: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
	Genesis: { bg: 'bg-emerald-50', accent: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
	Exodus: { bg: 'bg-red-50', accent: 'text-red-700', badge: 'bg-red-100 text-red-800' },
	'Exodus / Leviticus': { bg: 'bg-red-50', accent: 'text-red-700', badge: 'bg-red-100 text-red-800' },
	'Leviticus / Numbers': { bg: 'bg-orange-50', accent: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
	Deuteronomy: { bg: 'bg-yellow-50', accent: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' },
	Joshua: { bg: 'bg-lime-50', accent: 'text-lime-700', badge: 'bg-lime-100 text-lime-800' },
	Judges: { bg: 'bg-teal-50', accent: 'text-teal-700', badge: 'bg-teal-100 text-teal-800' },
	'Ruth / 1 Samuel': { bg: 'bg-cyan-50', accent: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
	'1 Samuel': { bg: 'bg-sky-50', accent: 'text-sky-700', badge: 'bg-sky-100 text-sky-800' },
	'1–2 Samuel': { bg: 'bg-sky-50', accent: 'text-sky-700', badge: 'bg-sky-100 text-sky-800' },
	'1 Kings': { bg: 'bg-blue-50', accent: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
	'1 Kings / 2 Chronicles': { bg: 'bg-blue-50', accent: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
	'2 Kings': { bg: 'bg-indigo-50', accent: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' },
	'Ezra / Nehemiah': { bg: 'bg-violet-50', accent: 'text-violet-700', badge: 'bg-violet-100 text-violet-800' },
	Esther: { bg: 'bg-purple-50', accent: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
	Job: { bg: 'bg-stone-50', accent: 'text-stone-700', badge: 'bg-stone-100 text-stone-800' },
	Psalms: { bg: 'bg-rose-50', accent: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
	'Proverbs / Ecclesiastes': { bg: 'bg-amber-50', accent: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
	Isaiah: { bg: 'bg-blue-50', accent: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
	'Jeremiah / Lamentations': { bg: 'bg-slate-50', accent: 'text-slate-700', badge: 'bg-slate-100 text-slate-800' },
	Ezekiel: { bg: 'bg-emerald-50', accent: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
	Daniel: { bg: 'bg-orange-50', accent: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' },
	'Hosea / Joel': { bg: 'bg-teal-50', accent: 'text-teal-700', badge: 'bg-teal-100 text-teal-800' },
	'Minor Prophets': { bg: 'bg-cyan-50', accent: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
	Conference: { bg: 'bg-gray-50', accent: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' },
	Christmas: { bg: 'bg-red-50', accent: 'text-red-700', badge: 'bg-red-100 text-red-800' }
};

const defaultColors = { bg: 'bg-gray-50', accent: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' };

export function getBookColors(book: string) {
	return bookColors[book] ?? defaultColors;
}
