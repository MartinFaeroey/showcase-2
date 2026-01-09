<script lang="ts">
    interface Props {
		tag: string;
	}

    let { tag }: Props = $props();
</script>

<div class="border dark:border-white/25 border-black/25 px-2 rounded">
    {tag}
</div>