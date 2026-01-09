<script lang="ts">
	import type { PageProps } from './$types';
	import type { GemData } from '$lib/types';
	import { defaultFilters, fuzzySearch, filterByTags, type Filters } from '$features/filtering';
	import Checkbox from '$lib/components/Checkbox.svelte';
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


<label class="grid p-4">
	<span>Search for gem</span>
	<input type="text" bind:value={search} placeholder="e.g: Split arrow" class="border p-2" >
</label>
<fieldset class="flex gap-4 px-4">
	<legend class="border-b dark:border-white/25 border-black/25 dark:text-white/75 text-black/75 pb-2 mb-2">Filter by attributes:</legend>
	<Checkbox label="Intelligence" bind:checked={tagFilters.intelligence} />
	<Checkbox label="Strength" bind:checked={tagFilters.strength} />
	<Checkbox label="Dexterity" bind:checked={tagFilters.dexterity} />
</fieldset>

<ListGems gems={gems} />