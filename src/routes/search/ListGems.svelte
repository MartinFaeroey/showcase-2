<script lang="ts">
	import type { GemData } from "$lib/types";

    interface Props {
		gems: GemData[];
	}

	let { gems }: Props = $props();
</script>

<div class="grid">
	{#if gems.length === 0}
	<div class="grid items-center p-4 w-full text-center">
		<p>No gems found.</p>
	</div>
	{:else}
		<ul class="grid gap-2 p-2 p-4">
			{#each gems as gem}
				<li class="flex gap-2">
					<div class="">{gem.name}</div>
					<div class="flex gap-1 text-sm">
						{#each gem.tags as tag}
							<div class="border px-1 rounded">{tag}</div>
						{/each}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>