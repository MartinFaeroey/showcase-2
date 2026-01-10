<script lang="ts">
	import type { PageProps } from './$types';
	import type { GemData } from '$lib/types';
	import { defaultFilters, fuzzySearch, filterByTags, type Filters } from '$features/filtering';
	import { Checkbox, TextInput } from '$lib/components';
	import ListGems from './ListGems.svelte';

	let { data }: PageProps = $props();

	let search = $state('')
	let tagFilters = $state<Filters>(defaultFilters)
	
	let gems = $derived(
		data.gems
			.filter((gem: GemData) => fuzzySearch(gem.name, search))
			.filter((gem: GemData) => filterByTags(gem.tags, tagFilters))
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
		<ListGems gems={gems} />
	</main>
</div>