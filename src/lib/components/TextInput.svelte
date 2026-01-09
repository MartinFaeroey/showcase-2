<script lang="ts">
	interface Props {
		label: string;
		value: string;
        placeholder?: string;
	}
	let { label, value = $bindable<string>(), placeholder }: Props = $props();
</script>

<label class="grid">
    <span class="block text-sm">
        {label}
    </span>
    <input
        type="text"
        bind:value={value}
        placeholder={placeholder ?? ''}
        class="block border-b py-2 text-lg dark:border-white/25 border-black/25 focus:outline-none focus:ring-0 focus:border-black/75 dark:focus:border-white/75 transition"
    >
</label>