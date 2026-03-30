<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen">
	<header class="border-b border-border bg-surface sticky top-0 z-10">
		<div class="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
			<a href="/" class="text-lg font-semibold text-primary">Joey</a>
			<span class="text-xs text-text-muted">Come Follow Me 2026</span>
		</div>
	</header>

	<main class="mx-auto max-w-2xl px-4 py-6">
		{@render children()}
	</main>
</div>
