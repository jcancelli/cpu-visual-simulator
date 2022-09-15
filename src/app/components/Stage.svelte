<script lang="ts">
	import { ram as ramComponent, cpu as cpuComponent, wires as wiresComponent } from "../store/components"
	import { showNodes } from "../store/debug"
	import Nodes from "../wires/Nodes"
	import Wires from "../wires/Wires.svelte"
	import Cpu from "./cpu/Cpu.svelte"
	import Ram from "./ram/Ram.svelte"
	import NodeMarker from "../wires/NodeMarker.svelte"
	import symbolTableStore from "../store/symbolTable"
	import { ramStore, cpuStore } from "../store/state"
</script>

<div class="absolute top-0 left-0 w-app h-app">
	<Wires bind:this={$wiresComponent} />
	<Cpu bind:this={$cpuComponent} cpu={$cpuStore} />
	<Ram bind:this={$ramComponent} ram={$ramStore} symbolTable={$symbolTableStore} />
	{#if $showNodes}
		{#each Nodes as node}
			<NodeMarker {node} />
		{/each}
	{/if}
</div>
