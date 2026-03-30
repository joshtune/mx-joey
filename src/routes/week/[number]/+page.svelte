<script lang="ts">
	import { formatDateRange } from '$lib/utils';
	import { getBookColors } from '$lib/book-colors';
	import { base } from '$app/paths';
	import type { PageData } from './$types';
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
		Sparkles
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	const prevWeek = $derived(data.lesson.weekNumber > 1 ? data.lesson.weekNumber - 1 : null);
	const nextWeek = $derived(data.lesson.weekNumber < 52 ? data.lesson.weekNumber + 1 : null);
	const progress = $derived(Math.round((data.lesson.weekNumber / 52) * 100));
	const colors = $derived(getBookColors(data.lesson.book));
</script>

<svelte:head>
	<title>Week {data.lesson.weekNumber} — {data.lesson.title} | Joey</title>
</svelte:head>

<!-- Progress Bar -->
<div class="mb-4">
	<div class="flex items-center justify-between text-xs text-text-muted mb-1">
		<span>Old Testament Journey</span>
		<span>Week {data.lesson.weekNumber} of 52</span>
	</div>
	<div class="w-full bg-border rounded-full h-2">
		<div
			class="h-2 rounded-full bg-primary transition-all duration-300"
			style="width: {progress}%"
		></div>
	</div>
</div>

<!-- Navigation -->
<nav class="flex items-center justify-between mb-6">
	{#if prevWeek}
		<a
			href="{base}/week/{prevWeek}"
			class="text-sm text-primary hover:underline flex items-center gap-1"
		>
			<ChevronLeft size={16} /> Week {prevWeek}
		</a>
	{:else}
		<span></span>
	{/if}

	<a href="{base}/" class="text-xs text-text-muted hover:underline">Today</a>

	{#if nextWeek}
		<a
			href="{base}/week/{nextWeek}"
			class="text-sm text-primary hover:underline flex items-center gap-1"
		>
			Week {nextWeek} <ChevronRight size={16} />
		</a>
	{:else}
		<span></span>
	{/if}
</nav>

<!-- Lesson Header -->
<div class="rounded-xl p-5 mb-6" style={colors.bg}>
	<div class="flex items-center gap-2 mb-2">
		<span class="text-xs font-medium px-2 py-0.5 rounded-full" style={colors.badge}>
			{data.lesson.book}
		</span>
		<span class="text-xs text-text-muted">
			{formatDateRange(data.lesson.dateStart, data.lesson.dateEnd)}
		</span>
	</div>
	<h1 class="text-2xl font-bold text-text mb-1">{data.lesson.title}</h1>
	<p class="text-sm text-text-muted">Week {data.lesson.weekNumber}</p>
</div>

{#if data.content}
	<!-- Quick Insight Banner -->
	{#if data.content.quickInsight}
		<div class="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mb-8">
			<div class="flex items-start gap-3">
				<Sparkles size={18} class="text-primary mt-0.5 shrink-0" />
				<p class="text-sm text-text font-medium italic">{data.content.quickInsight}</p>
			</div>
		</div>
	{/if}

	<!-- Quick Study Section -->
	{#if data.content.quickStudy}
		<div class="mb-8 space-y-5">
			<div class="flex items-center gap-2 border-b border-border pb-2">
				<BookOpen size={18} class="text-primary" />
				<h2 class="text-base font-semibold text-text">Quick Study</h2>
				<span class="text-xs text-text-muted ml-auto">5 min read</span>
			</div>

			<!-- What Happens -->
			{#if data.content.quickStudy.summary}
				<div class="bg-surface border border-border rounded-xl p-5">
					<h3 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
						<Scroll size={14} />
						What Happens
					</h3>
					<p class="text-sm text-text leading-relaxed whitespace-pre-line">{data.content.quickStudy.summary}</p>
				</div>
			{/if}

			<!-- Must-Read Passages -->
			{#if data.content.quickStudy.mustRead?.length > 0}
				<div>
					<h3 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
						<BookMarked size={14} />
						Must-Read Passages
					</h3>
					<ul class="space-y-2">
						{#each data.content.quickStudy.mustRead as passage, i (i)}
							<li class="bg-surface border border-border rounded-xl p-4">
								<span class="text-sm font-semibold text-primary block mb-1">{passage.reference}</span>
								<span class="text-sm text-text-muted">{passage.why}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Quotable Verses -->
			{#if data.content.quickStudy.quotableVerses?.length > 0}
				<div>
					<h3 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
						<Quote size={14} />
						Share These Verses
					</h3>
					<div class="space-y-3">
						{#each data.content.quickStudy.quotableVerses as verse, i (i)}
							<blockquote class="relative bg-primary/5 border border-primary/10 rounded-xl p-5">
								<div class="absolute top-3 left-4 text-primary/20 text-4xl font-serif leading-none">&ldquo;</div>
								<p class="text-sm text-text italic pl-6 leading-relaxed">{verse.text}</p>
								<cite class="block text-xs font-semibold text-primary mt-3 pl-6 not-italic">{verse.reference}</cite>
							</blockquote>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Historical Context -->
			{#if data.content.quickStudy.context}
				<div class="bg-surface border border-border rounded-xl p-5">
					<h3 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
						<MapPin size={14} />
						Context That Makes It Click
					</h3>
					<p class="text-sm text-text leading-relaxed whitespace-pre-line">{data.content.quickStudy.context}</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Divider -->
	<div class="flex items-center gap-3 my-8">
		<div class="flex-1 border-t border-border"></div>
		<span class="text-xs text-text-muted font-medium uppercase tracking-wide">For the Quorum</span>
		<div class="flex-1 border-t border-border"></div>
	</div>

	<!-- Key Themes -->
	{#if data.content.keyThemes.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Key Themes</h2>
			<div class="flex flex-wrap gap-2">
				{#each data.content.keyThemes as theme, i (i)}
					<span class="bg-primary-light text-primary text-xs px-3 py-1.5 rounded-full font-medium">{theme}</span>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Discussion Questions -->
	{#if data.content.discussionQuestions.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
				<MessageCircleQuestion size={14} />
				Discussion Questions
			</h2>
			<ul class="space-y-3">
				{#each data.content.discussionQuestions as question, i (i)}
					<li class="bg-surface border border-border rounded-xl p-4 text-sm flex gap-3">
						<span class="text-primary font-bold shrink-0">{i + 1}</span>
						<span>{question}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Teaching Ideas -->
	{#if data.content.teachingIdeas.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
				<Lightbulb size={14} />
				Teaching Ideas
			</h2>
			<ul class="space-y-3">
				{#each data.content.teachingIdeas as idea, i (i)}
					<li class="bg-surface border border-border rounded-xl p-4 text-sm">{idea}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Activities -->
	{#if data.content.activities.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
				<Activity size={14} />
				Activity Ideas
			</h2>
			<ul class="space-y-3">
				{#each data.content.activities as activity, i (i)}
					<li class="bg-surface border border-border rounded-xl p-4 text-sm">{activity}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Generated timestamp -->
	<div class="text-xs text-text-muted text-center mt-10 mb-4">
		Generated {new Date(data.content.generatedAt).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		})}
	</div>
{:else}
	<!-- Empty state -->
	<div class="text-center py-16">
		<BookOpen size={48} class="mx-auto text-text-muted/40 mb-4" />
		<h2 class="text-lg font-semibold text-text mb-2">No content yet for this week</h2>
		<p class="text-sm text-text-muted mb-4">
			Generate ideas for this lesson by running:
		</p>
		<code class="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-primary inline-block">
			npm run generate -- --week {data.lesson.weekNumber}
		</code>
		<p class="text-xs text-text-muted mt-4">
			Or run <code class="text-primary">npm run generate</code> to generate for next Sunday
		</p>
	</div>
{/if}
