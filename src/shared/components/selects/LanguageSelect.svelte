<script lang="ts">
	import { SvelteComponent } from "svelte"
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@rgossiaux/svelte-headlessui"
	import It from "../flags/it.svelte"
	import En from "../flags/en.svelte"
	import Es from "../flags/es.svelte"
	import { Language, SUPPORTED_LANGUAGES } from "../../util/i18n"

	export let value: Language

	const flags = new Map<Language, typeof SvelteComponent>([
		["en", En],
		["it", It],
		["es", Es]
	])
</script>

<Listbox bind:value on:change={e => (value = e.detail)}>
	<ListboxButton>
		<svelte:component this={flags.get(value)} class="w-12 h-7" />
	</ListboxButton>
	<ListboxOptions
		class="absolute flex flex-col gap-1 py-2 px-1 overflow-y-auto overflow-x-hidden max-h-28 z-10 bg-gray-100 rounded-md shadow-md"
	>
		{#each SUPPORTED_LANGUAGES as language (language)}
			<ListboxOption value={language}>
				<svelte:component this={flags.get(language)} class="w-12 h-7 cursor-pointer shadow-md" />
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
