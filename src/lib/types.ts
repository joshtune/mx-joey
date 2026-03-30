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

export interface ContentSection {
	title: string;
	icon: string;
	items: string[];
}

export interface GeneratedContent {
	weekNumber: number;
	generatedAt: string;
	lessonTitle?: string;
	sourceUrl?: string;
	quickInsight: string;
	quotableVerses: ScriptureQuote[];
	sections: ContentSection[];
	// Legacy fields for backward compatibility with old content
	quickStudy?: unknown;
	keyThemes?: string[];
	discussionQuestions?: string[];
	teachingIdeas?: string[];
	activities?: string[];
}
