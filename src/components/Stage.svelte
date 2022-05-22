<script lang="ts">
	import { ram, cpu, wires } from "../store/componentsStore"
	import debugStore from "../store/debugStore"
	import Nodes from "../wires/Nodes"
	import Wires from "../wires/Wires.svelte"
	import Cpu from "./cpu/Cpu.svelte"
	import Ram from "./ram/Ram.svelte"
	import NodeMarker from "../wires/NodeMarker.svelte"
</script>

<div class="stage">
	<Wires bind:this={$wires} />
	<Cpu bind:this={$cpu} />
	<Ram bind:this={$ram} />
	{#if $debugStore.showNodes}
		{#each Nodes as node}
			<NodeMarker {node} />
		{/each}
	{/if}
</div>

<style lang="scss">
	@import "../style/variables.scss";

	.stage {
		position: absolute;
		top: 0;
		left: 0;
		width: $stage-width;
		height: $stage-height;
	}
</style>
