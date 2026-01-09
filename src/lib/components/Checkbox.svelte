<script lang="ts">
	interface Props {
		label: string;
		checked: boolean;
		labelTextClasses?: string;
	}
	let { label, checked = $bindable<boolean>(), labelTextClasses }: Props = $props();
</script>

<label class="flex justify-between gap-2 accent-sky-500">
	<span class={labelTextClasses}>{label}</span>
	<input type="checkbox" bind:checked />
</label>
