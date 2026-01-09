<script lang="ts">
	import { Tag } from "$lib/components";
    import type { GemData } from "$lib/types";

    interface Props {
		gems: GemData[];
	}

	let { gems }: Props = $props();
</script>

<div class="grid">
	{#if gems.length === 0}
	<div class="grid items-center pt-12 pb-8 w-full text-center italic text-sm text-black/50 dark:text-white/50">
		<p>No gems found.</p>
	</div>
	{:else}
		<ul class="grid gap-2 py-4">
			{#each gems as gem}
				<li class="flex gap-2">
					<div class="">{gem.name}</div>
					<div class="flex gap-1 text-sm">
						{#each gem.tags as tag}
                            <Tag tag={tag} />
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>