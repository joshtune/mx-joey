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
	quickStudy: {
		summary: string;
		mustRead: { reference: string; why: string }[];
		quotableVerses: { reference: string; text: string }[];
		context: string;
	};
	discussionQuestions: string[];
	teachingIdeas: string[];
	activities: string[];
	keyThemes: string[];
	quickInsight: string;
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

		// Trim to a reasonable size for the prompt (keep first ~8000 chars of content)
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

CRITICAL: Base your response on the ACTUAL Come Follow Me manual content above. The manual content is your PRIMARY source. Draw themes, scriptures, and teaching ideas from what the Church has published for this week. Do NOT make up themes or ignore what the manual covers.`
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
- Use correct Church terminology: Heavenly Father, the Savior (not just "God" or "Jesus"), the Restoration, priesthood, temple covenants, the prophet, General Conference, For the Strength of Youth, sacrament, the Holy Ghost (not "Holy Spirit")
- Reference modern prophets and apostles when relevant (President Nelson, President Oaks, Elder Holland, Elder Bednar, etc.)
- Connect to Latter-day Saint youth experiences: seminary, mutual, sacrament meeting, missionary preparation, priesthood duties, temple trips
- Do NOT use language, hymns, or concepts from other Christian denominations

Generate content that this leader can use throughout the week — during Sunday class, at weekly activities, or in casual conversations with the young men. The tone should be:
- Relatable to 14-15 year old young men
- Grounded in the scriptures and the Come Follow Me manual
- Connected to their daily lives (school, sports, friends, social media, goals, priesthood service)
- Encouraging and uplifting, not preachy
- Practical — things they can actually do this week

Include a "quickStudy" section so the teacher can get grounded in the actual scriptures quickly — even if he only has 5 minutes. The summary should reflect what the Come Follow Me manual actually teaches for this week. The quotable verses should be EXACT scripture text (KJV for Bible, standard text for Book of Mormon/D&C/PGP).

Also include a "lessonTitle" field with the official lesson title from the Come Follow Me manual.

Respond with ONLY valid JSON in this exact format (no markdown, no code fences, just raw JSON):

{
  "lessonTitle": "The official Come Follow Me lesson title for this week",
  "quickStudy": {
    "summary": "A 2-3 paragraph plain-language summary of what this week's Come Follow Me lesson covers — the key scriptures, the themes the manual focuses on, and what the Church wants members to take away. Write it like you're briefing a fellow leader.",
    "mustRead": [
      {"reference": "Isaiah 53:4-5", "why": "Why this passage matters and what the Come Follow Me manual highlights about it"},
      {"reference": "...", "why": "..."}
    ],
    "quotableVerses": [
      {"reference": "Isaiah 25:8", "text": "The exact scripture text — word for word"},
      {"reference": "...", "text": "..."}
    ],
    "context": "1-2 paragraphs of doctrinal or historical context from a Latter-day Saint perspective — connect Old Testament passages to Restoration scripture, modern prophets, or temple symbolism where relevant"
  },
  "quickInsight": "A single sentence — the one thing you'd want to share if you only had 30 seconds with one of the boys in the hallway",
  "keyThemes": ["3-5 key themes from this week's manual reading that connect to their lives"],
  "discussionQuestions": ["4-5 thought-provoking questions for quorum discussion — draw from the manual's suggested questions and themes"],
  "teachingIdeas": ["3-4 ways to teach these principles — approaches, object lessons, stories, analogies that land with teenage young men in the Church"],
  "activities": ["2-3 activity ideas that reinforce this week's principles — things you could do at mutual or as a quorum, consistent with Church activity guidelines"]
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

	// Fetch the actual Come Follow Me manual content
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
		console.error('Install: https://docs.anthropic.com/en/docs/claude-code/overview');
		process.exit(1);
	}

	// Parse JSON from response — handle potential markdown wrapping
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

	// Save to file
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
	console.log(`${content.discussionQuestions.length} discussion questions`);
	console.log(`${content.teachingIdeas.length} teaching ideas`);
	console.log(`${content.activities.length} activity ideas`);
	console.log(`\nDone! Open http://localhost:5176/week/${lesson.weekNumber} to view.`);
}

main();
