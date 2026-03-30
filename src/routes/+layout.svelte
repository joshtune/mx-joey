<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { Sun, Moon } from '@lucide/svelte';

	let { children } = $props();
	let dark = $state(true);

	onMount(() => {
		const saved = localStorage.getItem('joey-theme');
		dark = saved ? saved === 'dark' : true;
		applyTheme();
	});

	function applyTheme() {
		document.documentElement.classList.toggle('dark', dark);
	}

	function toggleTheme() {
		dark = !dark;
		localStorage.setItem('joey-theme', dark ? 'dark' : 'light');
		applyTheme();
	}
</script>

<div class="min-h-screen">
	<header class="border-b border-border bg-surface sticky top-0 z-10">
		<div class="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
			<a href="{base}/" class="text-lg font-semibold text-primary">Joey</a>
			<div class="flex items-center gap-3">
				<span class="text-xs text-text-muted">Come Follow Me 2026</span>
				<button
					onclick={toggleTheme}
					class="p-1.5 rounded-lg hover:bg-border/50 transition-colors text-text-muted"
					aria-label="Toggle theme"
				>
					{#if dark}
						<Sun size={16} />
					{:else}
						<Moon size={16} />
					{/if}
				</button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-2xl px-4 py-6">
		{@render children()}
	</main>
</div>
