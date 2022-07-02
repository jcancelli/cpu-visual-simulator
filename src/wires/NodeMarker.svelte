<script lang="ts">
	import Node from "./Node"
	import { showNodesNames, showNodesCoordinates } from "../store/debug"

	export let node: Node
</script>

<div class="absolute z-10" style="top: {node.y}px; left: {node.x}px;">
	<div
		class="absolute top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border border-fuchsia-500"
		title={`${node.name} x: ${node.x} y: ${node.y}`}
	/>
	<div class="relative left-[7px] top-[-10px] bg-white font-bold">
		{#if $showNodesNames}
			<span class="text-fuchsia-500">{node.name}</span>
		{/if}
		{#if $showNodesCoordinates}
			<span class="text-blue-700">x: {node.x}</span>
			<span class="text-red-700">y: {node.y}</span>
		{/if}
	</div>
</div>
