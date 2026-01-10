<script lang="ts">
	interface Props {
		label: string;
		checked: boolean;
		labelTextClasses?: string;
	}
	let { label, checked = $bindable<boolean>(), labelTextClasses }: Props = $props();
</script>

<label class="flex justify-between gap-2 dark:accent-white accent-black items-center text">
	<input type="checkbox" bind:checked />
	<span class={labelTextClasses}>{label}</span>
</label>
