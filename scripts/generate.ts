import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CONTENT_DIR = resolve(PROJECT_ROOT, 'data/content');

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
	discussionQuestions: string[];
	teachingIdeas: string[];
	activities: string[];
	keyThemes: string[];
	quickInsight: string;
}

// Inline the schedule lookup to avoid $lib alias issues in scripts
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

	// Fallback: find current week
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

function buildPrompt(lesson: Lesson): string {
	return `You are helping a 1st Counselor in the Bishopric prepare to teach and mentor his Teachers Quorum (young men ages 14-15) in The Church of Jesus Christ of Latter-day Saints.

This week's Come Follow Me lesson:
- Scripture Block: ${lesson.scriptureBlock}
- Book: ${lesson.book}
- Week: ${lesson.weekNumber} (${lesson.dateStart} to ${lesson.dateEnd})

Generate content that this leader can use throughout the week — during Sunday class, at weekly activities, or in casual conversations with the young men. The tone should be:
- Relatable to 14-15 year old young men
- Grounded in the scriptures but connected to their daily lives (school, sports, friends, social media, goals)
- Encouraging and uplifting, not preachy
- Practical — things they can actually do this week

Respond with ONLY valid JSON in this exact format (no markdown, no code fences, just raw JSON):

{
  "quickInsight": "A single sentence — the one thing you'd want to share if you only had 30 seconds with one of the boys in the hallway",
  "keyThemes": ["3-5 key themes from this week's reading that connect to their lives"],
  "discussionQuestions": ["4-5 thought-provoking questions for class discussion — questions that make them think, not just recall facts"],
  "teachingIdeas": ["3-4 ways to teach or share these principles — approaches, object lessons, stories, analogies that land with teenage guys"],
  "activities": ["2-3 activity ideas that reinforce this week's principles — things you could do at mutual or as a quorum"]
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

	const prompt = buildPrompt(lesson);

	console.log('Running claude CLI...\n');

	let response: string;
	try {
		const claudePath = process.env.CLAUDE_PATH || '/Users/joshtune/.local/bin/claude';
		response = execSync(`${claudePath} -p ${JSON.stringify(prompt)}`, {
			encoding: 'utf-8',
			timeout: 120000,
			maxBuffer: 1024 * 1024,
			env: { ...process.env, PATH: `${process.env.PATH}:/Users/joshtune/.local/bin` }
		}).trim();
	} catch (_err) {
		console.error('Failed to run claude CLI. Make sure claude is installed and in your PATH.');
		console.error(
			'Install: https://docs.anthropic.com/en/docs/claude-code/overview'
		);
		process.exit(1);
	}

	// Parse JSON from response — handle potential markdown wrapping
	let jsonStr = response;
	const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
	if (jsonMatch) {
		jsonStr = jsonMatch[1];
	}

	let parsed: Omit<GeneratedContent, 'weekNumber' | 'generatedAt'>;
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
	console.log(`\nQuick insight: "${content.quickInsight}"`);
	console.log(`${content.discussionQuestions.length} discussion questions`);
	console.log(`${content.teachingIdeas.length} teaching ideas`);
	console.log(`${content.activities.length} activity ideas`);
	console.log(`\nDone! Open http://localhost:5176/week/${lesson.weekNumber} to view.`);
}

main();
