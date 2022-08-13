<script lang="ts">
	import { SvelteComponent } from "svelte"
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@rgossiaux/svelte-headlessui"
	import { SupportedLang, SUPPORTED_LANGS } from "../../app/store/settings"
	import It from "./flags/it.svelte"
	import En from "./flags/en.svelte"

	export let value: SupportedLang

	const flags = new Map<SupportedLang, typeof SvelteComponent>([
		["en", En],
		["it", It]
	])
</script>

<Listbox bind:value on:change={e => (value = e.detail)}>
	<ListboxButton>
		<svelte:component this={flags.get(value)} class="w-12 h-7" />
	</ListboxButton>
	<ListboxOptions class="absolute flex flex-col gap-1 overflow-y-auto overflow-x-hidden h-28">
		{#each SUPPORTED_LANGS as language (language)}
			<ListboxOption value={language}>
				<svelte:component this={flags.get(language)} class="w-12 h-7 cursor-pointer" />
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
