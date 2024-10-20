<script lang="ts">
	import { setContext } from "svelte"
	import { persisted } from "svelte-persisted-store"
	import { type DebugNodesOptions } from "./sections/Nodes.svelte"
	import { type MenuPosition } from "./sections/General.svelte"
	import Menu from "./Menu.svelte"

	export let active: boolean = false

	setContext("debug", persisted("debug", active))
	// General
	setContext("debug-menu-opacity", persisted("debug-menu-opacity", 0.75))
	setContext("debug-menu-position", persisted<MenuPosition>("debug-menu-position", "top-right"))
	// Nodes
	setContext("debug-nodes", persisted("debug-nodes", false))
	setContext(
		"debug-nodes-options",
		persisted<DebugNodesOptions>("debug-nodes-options", {
			label: "always",
			radius: 6,
		})
	)
</script>

<slot />

{#if active}
	<Menu />
{/if}
