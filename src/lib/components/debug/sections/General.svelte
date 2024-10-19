<script lang="ts" context="module">
	export type MenuPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right"
</script>

<script lang="ts">
	import MenuSection from "../MenuSection.svelte"
	import { Label, Select, Range } from "flowbite-svelte"

	export let opacity: number
	export let position: MenuPosition

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
		<Select bind:value={position} items={positions} />
	</Label>
	<Label>
		Opacity
		<Range bind:value={opacity} min={0.1} max={1} step={0.1} />
	</Label>
</MenuSection>
