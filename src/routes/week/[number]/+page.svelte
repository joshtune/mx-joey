<script lang="ts">
	import { formatDateRange } from '$lib/utils';
	import { getBookColors } from '$lib/book-colors';
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import type { ContentSection } from '$lib/types';
	import {
		BookOpen,
		MessageCircleQuestion,
		Lightbulb,
		Activity,
		Quote,
		BookMarked,
		Scroll,
		MapPin,
		ChevronLeft,
		ChevronRight,
		ChevronDown,
		Sparkles,
		Heart,
		Shield,
		Users,
		Star,
		Link,
		Target
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	let { data }: { data: PageData } = $props();

	const prevWeek = $derived(data.lesson.weekNumber > 1 ? data.lesson.weekNumber - 1 : null);
	const nextWeek = $derived(data.lesson.weekNumber < 52 ? data.lesson.weekNumber + 1 : null);
	const progress = $derived(Math.round((data.lesson.weekNumber / 52) * 100));
	const colors = $derived(getBookColors(data.lesson.book));

	const iconMap: Record<string, Component> = {
		book: BookOpen,
		scroll: Scroll,
		map: MapPin,
		question: MessageCircleQuestion,
		lightbulb: Lightbulb,
		activity: Activity,
		heart: Heart,
		shield: Shield,
		users: Users,
		star: Star,
		link: Link,
		target: Target,
		quote: Quote,
		bookmark: BookMarked
	};

	function getIcon(name: string): Component {
		return iconMap[name] ?? BookOpen;
	}

	// Check for legacy content format
	const hasNewFormat = $derived(data.content && 'sections' in data.content && Array.isArray(data.content.sections));

	// Build legacy sections from old format
	function getLegacySections(): ContentSection[] {
		if (!data.content) return [];
		const sections: ContentSection[] = [];
		const c = data.content as any;
		if (c.quickStudy?.summary) {
			sections.push({ title: 'What Happens', icon: 'scroll', items: [c.quickStudy.summary] });
		}
		if (c.quickStudy?.mustRead?.length) {
			sections.push({ title: 'Must-Read Passages', icon: 'bookmark', items: c.quickStudy.mustRead.map((p: any) => `${p.reference} — ${p.why}`) });
		}
		if (c.quickStudy?.context) {
			sections.push({ title: 'Context', icon: 'map', items: [c.quickStudy.context] });
		}
		if (c.discussionQuestions?.length) {
			sections.push({ title: 'Discussion Questions', icon: 'question', items: c.discussionQuestions });
		}
		if (c.teachingIdeas?.length) {
			sections.push({ title: 'Teaching Ideas', icon: 'lightbulb', items: c.teachingIdeas });
		}
		if (c.activities?.length) {
			sections.push({ title: 'Activity Ideas', icon: 'activity', items: c.activities });
		}
		return sections;
	}

	const sections = $derived(hasNewFormat ? data.content!.sections : getLegacySections());

	// Get quotable verses from either format
	const verses = $derived(
		data.content
			? (data.content.quotableVerses ?? (data.content as any).quickStudy?.quotableVerses ?? [])
			: []
	);
</script>

<svelte:head>
	<title>Week {data.lesson.weekNumber} — {data.content?.lessonTitle ?? data.lesson.title} | Joey</title>
</svelte:head>

<!-- Progress Bar -->
<div class="mb-4">
	<div class="flex items-center justify-between text-xs text-text-muted mb-1">
		<span>Old Testament Journey</span>
		<span>Week {data.lesson.weekNumber} of 52</span>
	</div>
	<div class="w-full bg-border rounded-full h-1.5">
		<div
			class="h-1.5 rounded-full bg-primary transition-all duration-300"
			style="width: {progress}%"
		></div>
	</div>
</div>

<!-- Navigation -->
<nav class="flex items-center justify-between mb-5">
	{#if prevWeek}
		<a href="{base}/week/{prevWeek}" class="text-sm text-primary hover:underline flex items-center gap-1">
			<ChevronLeft size={16} /> Week {prevWeek}
		</a>
	{:else}
		<span></span>
	{/if}
	<a href="{base}/" class="text-xs text-text-muted hover:underline">Today</a>
	{#if nextWeek}
		<a href="{base}/week/{nextWeek}" class="text-sm text-primary hover:underline flex items-center gap-1">
			Week {nextWeek} <ChevronRight size={16} />
		</a>
	{:else}
		<span></span>
	{/if}
</nav>

<!-- Lesson Header -->
<div class="rounded-xl p-4 mb-5" style={colors.bg}>
	<div class="flex items-center gap-2 mb-1.5">
		<span class="text-xs font-medium px-2 py-0.5 rounded-full" style={colors.badge}>{data.lesson.book}</span>
		<span class="text-xs text-text-muted">{formatDateRange(data.lesson.dateStart, data.lesson.dateEnd)}</span>
	</div>
	{#if data.content?.lessonTitle}
		<h1 class="text-xl font-bold text-text">{data.content.lessonTitle}</h1>
		<p class="text-sm text-text-muted mt-0.5">{data.lesson.scriptureBlock}</p>
	{:else}
		<h1 class="text-xl font-bold text-text">{data.lesson.title}</h1>
	{/if}
	{#if data.content?.sourceUrl}
		<a href={data.content.sourceUrl} target="_blank" rel="noopener" class="text-xs text-primary hover:underline mt-1.5 inline-block">Read in manual &rarr;</a>
	{/if}
</div>

{#if data.content}
	<!-- READY TO SHARE — always visible -->
	{#if data.content.quickInsight}
		<div class="bg-primary/5 border-l-4 border-primary rounded-r-lg p-3 mb-5">
			<div class="flex items-start gap-2">
				<Sparkles size={16} class="text-primary mt-0.5 shrink-0" />
				<p class="text-sm text-text font-medium italic">{data.content.quickInsight}</p>
			</div>
		</div>
	{/if}

	<!-- Quotable Verses — always visible -->
	{#if verses.length > 0}
		<div class="mb-5 space-y-2.5">
			{#each verses as verse, i (i)}
				<blockquote class="relative bg-primary/5 border border-primary/10 rounded-xl p-4">
					<div class="absolute top-2 left-3 text-primary/20 text-3xl font-serif leading-none">&ldquo;</div>
					<p class="text-sm text-text italic pl-5 leading-relaxed">{verse.text}</p>
					<cite class="block text-xs font-semibold text-primary mt-2 pl-5 not-italic">{verse.reference}</cite>
				</blockquote>
			{/each}
		</div>
	{/if}

	<!-- Collapsible Sections -->
	{#if sections.length > 0}
		<div class="space-y-2">
			{#each sections as section, i (i)}
				{@const SectionIcon = getIcon(section.icon)}
				<details class="group bg-surface border border-border rounded-xl">
					<summary class="flex items-center gap-2 px-4 py-3 cursor-pointer select-none list-none">
						<SectionIcon size={16} class="text-primary shrink-0" />
						<span class="text-sm font-semibold text-text flex-1">{section.title}</span>
						<span class="text-xs text-text-muted mr-1">{section.items.length}</span>
						<ChevronDown size={14} class="text-text-muted transition-transform group-open:rotate-180" />
					</summary>
					<div class="px-4 pb-3">
						<ul class="space-y-2">
							{#each section.items as item, j (j)}
								<li class="text-sm text-text-muted pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-primary/40">{item}</li>
							{/each}
						</ul>
					</div>
				</details>
			{/each}
		</div>
	{/if}

	<!-- Generated timestamp -->
	<div class="text-xs text-text-muted text-center mt-8 mb-4">
		Generated {new Date(data.content.generatedAt).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		})}
	</div>
{:else}
	<div class="text-center py-16">
		<BookOpen size={48} class="mx-auto text-text-muted/40 mb-4" />
		<h2 class="text-lg font-semibold text-text mb-2">No content yet for this week</h2>
		<p class="text-sm text-text-muted mb-4">Generate ideas by running:</p>
		<code class="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-primary inline-block">
			npm run generate -- --week {data.lesson.weekNumber}
		</code>
	</div>
{/if}
