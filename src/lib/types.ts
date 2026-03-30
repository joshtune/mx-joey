export interface Lesson {
	weekNumber: number;
	dateStart: string;
	dateEnd: string;
	title: string;
	scriptureBlock: string;
	book: string;
}

export interface ScriptureQuote {
	reference: string;
	text: string;
}

export interface MustReadPassage {
	reference: string;
	why: string;
}

export interface QuickStudy {
	summary: string;
	mustRead: MustReadPassage[];
	quotableVerses: ScriptureQuote[];
	context: string;
}

export interface GeneratedContent {
	weekNumber: number;
	generatedAt: string;
	lessonTitle?: string;
	sourceUrl?: string;
	quickStudy: QuickStudy;
	discussionQuestions: string[];
	teachingIdeas: string[];
	activities: string[];
	keyThemes: string[];
	quickInsight: string;
}
