import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CONTENT_DIR = resolve(PROJECT_ROOT, 'data/content');

const CFM_BASE_URL =
	'https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026';

interface Lesson {
	weekNumber: number;
	dateStart: string;
	dateEnd: string;
	title: string;
	scriptureBlock: string;
	book: string;
}

interface GeneratedContent {
	weekNumber: number;
	generatedAt: string;
	lessonTitle: string;
	sourceUrl: string;
	quickInsight: string;
	quotableVerses: { reference: string; text: string }[];
	sections: { title: string; icon: string; items: string[] }[];
}

async function loadSchedule(): Promise<Lesson[]> {
	const mod = await import('../src/lib/data/schedule.ts');
	return mod.schedule;
}

function getNextSundayWeekNumber(schedule: Lesson[]): number {
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

	const todayStr = today.toISOString().split('T')[0];
	for (const lesson of schedule) {
		if (todayStr >= lesson.dateStart && todayStr <= lesson.dateEnd) {
			return lesson.weekNumber;
		}
	}

	return 1;
}

function parseWeekArg(): number | null {
	const args = process.argv.slice(2);
	const weekIdx = args.indexOf('--week');
	if (weekIdx !== -1 && args[weekIdx + 1]) {
		return parseInt(args[weekIdx + 1], 10);
	}
	return null;
}

function stripHtml(html: string): string {
	return html
		.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
		.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
		.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

async function fetchCfmContent(weekNumber: number): Promise<{ text: string; url: string }> {
	const url = `${CFM_BASE_URL}/${weekNumber}?lang=eng`;
	console.log(`Fetching Come Follow Me manual: ${url}`);

	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; Joey/1.0; lesson-prep)',
				Accept: 'text/html'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const html = await response.text();
		const text = stripHtml(html);
		const trimmed = text.length > 8000 ? text.slice(0, 8000) + '...' : text;

		console.log(`Fetched ${text.length} chars of lesson content (using ${trimmed.length})\n`);
		return { text: trimmed, url };
	} catch (err) {
		console.warn(`Could not fetch CFM content: ${err}`);
		console.warn('Falling back to generation without manual content.\n');
		return { text: '', url };
	}
}

function buildPrompt(lesson: Lesson, cfmContent: string, cfmUrl: string): string {
	const contentSection = cfmContent
		? `
OFFICIAL COME FOLLOW ME MANUAL CONTENT (from ${cfmUrl}):
---
${cfmContent}
---

CRITICAL: Base your response on the ACTUAL Come Follow Me manual content above. The manual content is your PRIMARY source. Let the manual's structure, themes, and emphasis drive what sections you create. Do NOT ignore what the manual covers.`
		: `Note: Could not fetch the official manual content. Generate based on the scripture block, but keep it firmly grounded in Latter-day Saint doctrine.`;

	return `You are helping a 1st Counselor in the Bishopric prepare to teach and mentor his Teachers Quorum (young men ages 14-15) in The Church of Jesus Christ of Latter-day Saints.

This week's Come Follow Me lesson:
- Scripture Block: ${lesson.scriptureBlock}
- Book: ${lesson.book}
- Week: ${lesson.weekNumber} (${lesson.dateStart} to ${lesson.dateEnd})

${contentSection}

LANGUAGE AND DOCTRINE REQUIREMENTS:
- Use ONLY language, terminology, and teachings consistent with The Church of Jesus Christ of Latter-day Saints
- Reference Latter-day Saint-specific scripture: Book of Mormon, Doctrine and Covenants, Pearl of Great Price — not just the Bible
- Use correct Church terminology: Heavenly Father, the Savior, the Restoration, priesthood, temple covenants, the prophet, General Conference, For the Strength of Youth, sacrament, the Holy Ghost
- Reference modern prophets and apostles when relevant
- Connect to Latter-day Saint youth experiences: seminary, mutual, sacrament meeting, missionary preparation, priesthood duties, temple trips
- Do NOT use language, hymns, or concepts from other Christian denominations

TARGET: This is a pocket reference a leader pulls up on his phone. Keep things SHORT and scannable.

FORMAT RULES:
1. "quickInsight" — ONE sentence. The hallway drop. 15 words max.
2. "quotableVerses" — 3-4 exact scripture quotes (KJV for Bible, standard text for Book of Mormon/D&C/PGP). These are always visible on the page so the leader can read them off his phone.
3. "sections" — This is where you ADAPT to the manual. Look at what the Come Follow Me manual emphasizes this week and create 4-6 sections that mirror its structure. Each section has a title, an icon hint, and short bullet-point items (1-2 sentences each, not paragraphs).

For the "icon" field, use one of: "book", "scroll", "map", "question", "lightbulb", "activity", "heart", "shield", "users", "star", "link", "target"

Example section types (use whatever fits THIS week's manual emphasis):
- "What Happens This Week" (icon: "scroll") — 3-4 bullet summary of the narrative/events
- "Prophecies Fulfilled" (icon: "link") — OT → NT connections if the manual highlights them
- "Overcoming Through Christ" (icon: "shield") — if the manual focuses on the Atonement's power
- "Discussion Questions" (icon: "question") — 3-4 questions for quorum discussion
- "Teaching Ideas" (icon: "lightbulb") — 2-3 object lessons or approaches
- "Activity Ideas" (icon: "activity") — 1-2 mutual activities
- "Doctrinal Context" (icon: "map") — Restoration connections, modern prophet quotes
- "For Their Daily Life" (icon: "target") — practical challenges for the week
- Any other section that fits what the manual is teaching

Keep items SHORT. A busy leader scanning his phone at mutual needs to see the point in one glance.

Respond with ONLY valid JSON (no markdown, no code fences):

{
  "lessonTitle": "The official Come Follow Me lesson title",
  "quickInsight": "One short sentence — the hallway drop",
  "quotableVerses": [
    {"reference": "Isaiah 25:8", "text": "Exact scripture text word for word"},
    {"reference": "Alma 7:11", "text": "Exact scripture text word for word"}
  ],
  "sections": [
    {
      "title": "Section title matching this week's emphasis",
      "icon": "scroll",
      "items": ["Short bullet point 1", "Short bullet point 2"]
    }
  ]
}`;
}

async function main() {
	const schedule = await loadSchedule();
	const targetWeek = parseWeekArg() ?? getNextSundayWeekNumber(schedule);

	const lesson = schedule.find((l) => l.weekNumber === targetWeek);
	if (!lesson) {
		console.error(`No lesson found for week ${targetWeek}`);
		process.exit(1);
	}

	console.log(`\nGenerating content for Week ${lesson.weekNumber}: ${lesson.title}`);
	console.log(`Scripture: ${lesson.scriptureBlock}`);
	console.log(`Dates: ${lesson.dateStart} to ${lesson.dateEnd}\n`);

	const { text: cfmContent, url: cfmUrl } = await fetchCfmContent(lesson.weekNumber);
	const prompt = buildPrompt(lesson, cfmContent, cfmUrl);

	console.log('Running claude CLI...\n');

	let response: string;
	try {
		const claudePath = process.env.CLAUDE_PATH || '/Users/joshtune/.local/bin/claude';
		response = execSync(`${claudePath} -p ${JSON.stringify(prompt)} --tools ""`, {
			encoding: 'utf-8',
			timeout: 180000,
			maxBuffer: 1024 * 1024 * 5,
			env: { ...process.env, PATH: `${process.env.PATH}:/Users/joshtune/.local/bin` }
		}).trim();
	} catch (_err) {
		console.error('Failed to run claude CLI. Make sure claude is installed and in your PATH.');
		process.exit(1);
	}

	let jsonStr = response;
	const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
	if (jsonMatch) {
		jsonStr = jsonMatch[1];
	}

	let parsed: Omit<GeneratedContent, 'weekNumber' | 'generatedAt' | 'sourceUrl'>;
	try {
		parsed = JSON.parse(jsonStr);
	} catch {
		console.error('Failed to parse JSON from Claude response.');
		console.error('Raw response:');
		console.error(response);
		process.exit(1);
	}

	const content: GeneratedContent = {
		weekNumber: lesson.weekNumber,
		generatedAt: new Date().toISOString(),
		sourceUrl: cfmUrl,
		...parsed
	};

	if (!existsSync(CONTENT_DIR)) {
		mkdirSync(CONTENT_DIR, { recursive: true });
	}

	const filePath = resolve(
		CONTENT_DIR,
		`week-${String(lesson.weekNumber).padStart(2, '0')}.json`
	);
	writeFileSync(filePath, JSON.stringify(content, null, '\t'), 'utf-8');

	console.log(`Content saved to ${filePath}`);
	console.log(`\nLesson: "${content.lessonTitle}"`);
	console.log(`Quick insight: "${content.quickInsight}"`);
	console.log(`${content.quotableVerses.length} quotable verses`);
	console.log(`${content.sections.length} sections`);
	content.sections.forEach((s) => console.log(`  - ${s.title} (${s.items.length} items)`));
	console.log(`\nDone! Open http://localhost:5176/week/${lesson.weekNumber} to view.`);
}

main();
