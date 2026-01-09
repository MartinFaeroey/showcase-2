<script lang="ts">
    interface Props {
		tag: string;
	}

    let { tag }: Props = $props();
</script>

<div class="border dark:border-white/15 border-black/15 dark:text-white/50 text-black/50 px-2 rounded font-mono">
    {tag}
</div>