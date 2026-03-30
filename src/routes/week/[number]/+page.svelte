<script lang="ts">
	import { formatDateRange } from '$lib/utils';
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const prevWeek = $derived(data.lesson.weekNumber > 1 ? data.lesson.weekNumber - 1 : null);
	const nextWeek = $derived(data.lesson.weekNumber < 52 ? data.lesson.weekNumber + 1 : null);
</script>

<svelte:head>
	<title>Week {data.lesson.weekNumber} — {data.lesson.title} | Joey</title>
</svelte:head>

<!-- Navigation -->
<nav class="flex items-center justify-between mb-6">
	{#if prevWeek}
		<a
			href="{base}/week/{prevWeek}"
			class="text-sm text-primary hover:underline flex items-center gap-1"
		>
			<span>&larr;</span> Week {prevWeek}
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
			Week {nextWeek} <span>&rarr;</span>
		</a>
	{:else}
		<span></span>
	{/if}
</nav>

<!-- Lesson Header -->
<div class="mb-8">
	<div class="text-xs text-text-muted uppercase tracking-wide mb-1">
		Week {data.lesson.weekNumber} &middot; {formatDateRange(data.lesson.dateStart, data.lesson.dateEnd)}
	</div>
	<h1 class="text-2xl font-bold text-text mb-1">{data.lesson.title}</h1>
	<div class="text-sm text-text-muted">{data.lesson.book}</div>
</div>

{#if data.content}
	<!-- Quick Insight -->
	{#if data.content.quickInsight}
		<div class="bg-primary-light border border-primary/20 rounded-lg p-4 mb-6">
			<p class="text-sm text-text italic">{data.content.quickInsight}</p>
		</div>
	{/if}

	<!-- Key Themes -->
	{#if data.content.keyThemes.length > 0}
		<section class="mb-6">
			<h2 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Key Themes</h2>
			<div class="flex flex-wrap gap-2">
				{#each data.content.keyThemes as theme, i (i)}
					<span class="bg-primary-light text-primary text-xs px-3 py-1 rounded-full">{theme}</span>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Discussion Questions -->
	{#if data.content.discussionQuestions.length > 0}
		<section class="mb-6">
			<h2 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Discussion Questions</h2>
			<ul class="space-y-3">
				{#each data.content.discussionQuestions as question, i (i)}
					<li class="bg-surface border border-border rounded-lg p-4 text-sm">{question}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Teaching Ideas -->
	{#if data.content.teachingIdeas.length > 0}
		<section class="mb-6">
			<h2 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Teaching Ideas</h2>
			<ul class="space-y-3">
				{#each data.content.teachingIdeas as idea, i (i)}
					<li class="bg-surface border border-border rounded-lg p-4 text-sm">{idea}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Activities -->
	{#if data.content.activities.length > 0}
		<section class="mb-6">
			<h2 class="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">Activity Ideas</h2>
			<ul class="space-y-3">
				{#each data.content.activities as activity, i (i)}
					<li class="bg-surface border border-border rounded-lg p-4 text-sm">{activity}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Generated timestamp -->
	<div class="text-xs text-text-muted text-center mt-8">
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
		<div class="text-4xl mb-4">📖</div>
		<h2 class="text-lg font-semibold text-text mb-2">No content yet for this week</h2>
		<p class="text-sm text-text-muted mb-4">
			Generate ideas for this lesson by running:
		</p>
		<code class="bg-surface border border-border rounded px-3 py-2 text-sm text-primary">
			npm run generate -- --week {data.lesson.weekNumber}
		</code>
		<p class="text-xs text-text-muted mt-4">
			Or run <code class="text-primary">npm run generate</code> to generate for next Sunday
		</p>
	</div>
{/if}
