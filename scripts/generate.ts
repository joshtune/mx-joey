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

	return `You are a 1st Counselor in the Bishopric. You oversee the Teachers Quorum — young men ages 14-15. You see these boys at church on Sunday, at mutual on Wednesday, and randomly during the week. You need to be ready to share something real with them at any moment.

This week's Come Follow Me lesson:
- Scripture Block: ${lesson.scriptureBlock}
- Book: ${lesson.book}
- Week: ${lesson.weekNumber} (${lesson.dateStart} to ${lesson.dateEnd})

${contentSection}

YOUR JOB:
The Come Follow Me manual is your DOCTRINAL FOUNDATION — it tells you what the Church wants taught this week. But DO NOT clone the manual. Your job is to take those doctrines and make them LAND with 14-year-old young men. Think:
- How does this connect to what they're actually dealing with? (peer pressure, identity, girls, school stress, sports, social media, figuring out who they are, feeling like they don't belong)
- What would make them sit up and pay attention instead of zoning out?
- What's the one thing that could stick with them all week?
- What would YOU say to one of these boys if you had 60 seconds in the hallway?

This is NOT a lesson plan. This is a leader's cheat sheet for connecting gospel truth to teenage reality.

DOCTRINE & LANGUAGE:
- Latter-day Saint terminology only: Heavenly Father, the Savior, the Restoration, priesthood, temple covenants, the prophet, the Holy Ghost, sacrament
- Reference Restoration scripture (Book of Mormon, D&C, Pearl of Great Price) alongside the Bible
- Modern prophets and apostles when relevant
- Connect to their LDS life: seminary, mutual, sacrament meeting, missionary prep, priesthood duties, temple trips
- No language or concepts from other denominations

FORMAT — this is a PHONE SCREEN, not a lesson manual:

1. "quickInsight" — ONE punchy sentence. Something you'd text a young man if you could. 15 words max.

2. "quotableVerses" — 3-4 scriptures with EXACT text. These are always visible so you can read them aloud to a boy on the spot. Pick verses that HIT — not just doctrinally important but emotionally resonant for a teenager.

3. "sections" — 4-6 collapsible sections. Adapt these to what the manual emphasizes, but filter everything through "will this connect with a 14-year-old?"

For "icon", use one of: "book", "scroll", "map", "question", "lightbulb", "activity", "heart", "shield", "users", "star", "link", "target"

Section types to choose from (pick what fits THIS week):
- "The Story" (icon: "scroll") — What happens in 3-4 bullets. Tell it like a story, not a summary.
- "Why This Matters to Them" (icon: "heart") — Connect the doctrine to their world. Be specific. Not "this teaches about faith" but "when your friend group drops you and you wonder if God even sees you — this is the chapter where He says He does."
- "Talk Starters" (icon: "question") — 3-4 questions that provoke real conversation, not Sunday School answers. Questions that make them think about their own life.
- "How to Teach It" (icon: "lightbulb") — 2-3 quick object lessons, analogies, or approaches. Things you can do in 5 minutes, not a full lesson production.
- "Do This at Mutual" (icon: "activity") — 1-2 activity ideas that reinforce the principle. Consistent with Church guidelines.
- "Challenge for the Week" (icon: "target") — Something specific they can do THIS week. Not vague "read your scriptures" but concrete.
- "Restoration Connection" (icon: "link") — How this ties to Book of Mormon, D&C, temple, modern prophets. Keep it brief.
- Any other section that fits the manual's emphasis reframed for teenage young men.

Keep every bullet to 1-2 sentences. A leader glancing at his phone during mutual needs the point instantly.

Respond with ONLY valid JSON (no markdown, no code fences):

{
  "lessonTitle": "The official Come Follow Me lesson title",
  "quickInsight": "One punchy sentence — the hallway drop",
  "quotableVerses": [
    {"reference": "Isaiah 25:8", "text": "Exact scripture text word for word"},
    {"reference": "Alma 7:11", "text": "Exact scripture text word for word"}
  ],
  "sections": [
    {
      "title": "Section title",
      "icon": "scroll",
      "items": ["Short bullet that connects to their life", "Another one"]
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
