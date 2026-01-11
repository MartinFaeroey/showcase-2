<script lang="ts">
	import type { PageProps } from './$types';
	import { defaultFilters, type Filters } from '$features/filtering';
	import { Checkbox, TextInput } from '$lib/components';
	import { useWorkerFiltering } from '$lib/hooks/useWorkerFiltering.svelte';
	import ListGems from './ListGems.svelte';

	const { data }: PageProps = $props();

	let search = $state('');
	let tagFilters = $state<Filters>(defaultFilters);

	// Use the worker filtering hook with getter functions
	const filtering = useWorkerFiltering(
		() => data.gems,
		() => search,
		() => tagFilters
	);
</script>

<div class="grid gap-4 p-4">
	<aside class="flex gap-4 flex-wrap">
		<fieldset class="flex gap-6 px-4 pb-4 pt-1 border dark:border-white/25 border-black/25">
			<legend class="dark:text-white/75 text-black/75 pr-2">Filter by attributes:</legend>
			<Checkbox label="Intelligence" bind:checked={tagFilters.intelligence} />
			<Checkbox label="Strength" bind:checked={tagFilters.strength} />
			<Checkbox label="Dexterity" bind:checked={tagFilters.dexterity} />
		</fieldset>
		<fieldset class="flex gap-6 px-4 pb-4 pt-1 border dark:border-white/25 border-black/25">
			<legend class="dark:text-white/75 text-black/75 pr-2">Filter by element:</legend>
			<Checkbox label="Physical" bind:checked={tagFilters.physical} />
			<Checkbox label="Fire" bind:checked={tagFilters.fire} />
			<Checkbox label="Cold" bind:checked={tagFilters.cold} />
			<Checkbox label="Lightning" bind:checked={tagFilters.lightning} />
			<Checkbox label="Chaos" bind:checked={tagFilters.chaos} />
		</fieldset>
	</aside>

	<main class="grid border dark:border-white/25 border-black/25 rounded p-4">
		<TextInput bind:value={search} label="Search for gem" placeholder="Split arrow" />

		{#if filtering.error}
			<div class="text-red-500 text-center py-4">
				<p>Error: {filtering.error}</p>
				<p class="text-sm mt-2">Falling back to basic filtering...</p>
			</div>
		{/if}

		{#if filtering.isFiltering}
			<div class="text-center py-4">
				<div class="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				<span class="ml-2">Filtering gems...</span>
			</div>
		{:else}
			<ListGems gems={filtering.filteredGems} />
		{/if}
	</main>
</div>
