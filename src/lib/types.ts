export interface Lesson {
	weekNumber: number;
	dateStart: string;
	dateEnd: string;
	title: string;
	scriptureBlock: string;
	book: string;
}

export interface GeneratedContent {
	weekNumber: number;
	generatedAt: string;
	discussionQuestions: string[];
	teachingIdeas: string[];
	activities: string[];
	keyThemes: string[];
	quickInsight: string;
}
