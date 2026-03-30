<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getNextSundayWeekNumber } from '$lib/utils';

	onMount(() => {
		const week = getNextSundayWeekNumber();
		goto(`${base}/week/${week}`, { replaceState: true });
	});
</script>

<div class="flex items-center justify-center py-20">
	<p class="text-text-muted text-sm">Loading this week's lesson...</p>
</div>
