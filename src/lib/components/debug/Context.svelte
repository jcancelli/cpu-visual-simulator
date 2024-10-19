<script lang="ts">
	import { setContext } from "svelte"
	import Menu from "./Menu.svelte"
	import { writable } from "svelte/store"
	import { type DebugNodesOptions } from "./sections/Nodes.svelte"

	export let active: boolean = false

	setContext("debug", writable(active))
	// Nodes
	setContext("debug-nodes", writable(false))
	setContext(
		"debug-nodes-options",
		writable<DebugNodesOptions>({
			label: "always",
			radius: 6,
		})
	)
</script>

<slot />

{#if active}
	<Menu />
{/if}
