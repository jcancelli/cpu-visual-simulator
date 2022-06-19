<script lang="ts">
	import { ram, cpu, wires } from "../store/components"
	import { showNodes } from "../store/debugStores"
	import Nodes from "../wires/Nodes"
	import Wires from "../wires/Wires.svelte"
	import Cpu from "./cpu/Cpu.svelte"
	import Ram from "./ram/Ram.svelte"
	import NodeMarker from "../wires/NodeMarker.svelte"
</script>

<div class="absolute top-0 left-0 w-app h-app">
	<Wires bind:this={$wires} />
	<Cpu bind:this={$cpu} />
	<Ram bind:this={$ram} />
	{#if $showNodes}
		{#each Nodes as node}
			<NodeMarker {node} />
		{/each}
	{/if}
</div>
