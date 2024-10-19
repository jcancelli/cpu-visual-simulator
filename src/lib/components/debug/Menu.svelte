<script lang="ts">
	import { getContext } from "svelte"
	import GeneralSection, { type MenuPosition } from "./sections/General.svelte"
	import NodesSection from "./sections/Nodes.svelte"
	import { type Writable } from "svelte/store"

	if (!getContext("debug")) {
		throw new Error("Debug flag is not set, but Debug Menu was created")
	}

	const opacity = getContext<Writable<number>>("debug-menu-opacity")
	const position = getContext<Writable<MenuPosition>>("debug-menu-position")
</script>

<div
	class="fixed max-h-screen bg-black p-2 text-white"
	style:opacity={$opacity}
	class:top-0={$position === "top-right" || $position === "top-left"}
	class:bottom-0={$position === "bottom-right" || $position === "bottom-left"}
	class:left-0={$position === "top-left" || $position === "bottom-left"}
	class:right-0={$position === "top-right" || $position === "bottom-right"}
>
	<h1 class="text-2xl">Debug menu</h1>
	<div class="flex flex-col gap-3 pl-2 pt-2">
		<GeneralSection bind:opacity={$opacity} bind:position={$position} />
		<NodesSection />
	</div>
</div>
