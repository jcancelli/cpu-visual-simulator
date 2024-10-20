<script lang="ts" context="module">
	export type MenuPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"
</script>

<script lang="ts">
	import { getContext } from "svelte"
	import { Label, Select, Range } from "flowbite-svelte"
	import MenuSection from "../MenuSection.svelte"
	import type { Writable } from "svelte/store"

	const opacity = getContext<Writable<number>>("debug-menu-opacity")
	const position = getContext<Writable<MenuPosition>>("debug-menu-position")

	const positions = [
		{ value: "top-left", name: "Top left" },
		{ value: "top-right", name: "Top right" },
		{ value: "bottom-left", name: "Bottom left" },
		{ value: "bottom-right", name: "Bottom right" },
	]
</script>

<MenuSection title="General">
	<Label>
		Position
		<Select bind:value={$position} items={positions} size={"sm"} />
	</Label>
	<Label>
		Opacity
		<Range bind:value={$opacity} min={0.1} max={1} step={0.1} />
	</Label>
</MenuSection>
