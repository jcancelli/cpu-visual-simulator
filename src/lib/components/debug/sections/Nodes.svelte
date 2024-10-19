<script lang="ts" context="module">
	export type DebugNodesOptions = {
		label: "always" | "on-hover" | "never"
		radius: number
	}
</script>

<script lang="ts">
	import { getContext } from "svelte"
	import MenuSection from "../MenuSection.svelte"
	import type { Writable } from "svelte/store"
	import { Toggle, Label, Select, Range } from "flowbite-svelte"

	const active = getContext<Writable<boolean>>("debug-nodes")
	const options = getContext<Writable<DebugNodesOptions>>("debug-nodes-options")

	const labelItems = [
		{ value: "always", name: "Always" },
		{ value: "on-hover", name: "On hover" },
		{ value: "never", name: "Never" },
	]
</script>

<MenuSection title="Nodes">
	<Toggle bind:checked={$active}>Active</Toggle>
	{#if $active}
		<Label>
			Show labels
			<Select bind:value={$options.label} items={labelItems} />
		</Label>
		<Label>
			Size
			<Range bind:value={$options.radius} min={1} max={20} step={1} />
		</Label>
	{/if}
</MenuSection>
