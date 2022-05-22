<script lang="ts">
	import Node from "./Node"
	import debugStore from "../store/debugStore"

	export let node: Node
</script>

<div class="node" style="top: {node.y}px; left: {node.x}px;">
	<div class="dot" title={`${node.name} x: ${node.x} y: ${node.y}`} />
	<div class="text">
		{#if $debugStore.showNodeNames}
			<span class="name">{node.name}</span>
		{/if}
		{#if $debugStore.showNodesCoordinates}
			<span class="x">x: {node.x}</span>
			<span class="y">y: {node.y}</span>
		{/if}
	</div>
</div>

<style lang="scss">
	.node {
		position: absolute;
		z-index: 100;
	}

	.text {
		position: relative;
		left: 7px;
		top: -10px;
		background-color: white;
		font-weight: bold;
	}

	.name {
		color: fuchsia;
	}

	.x {
		color: blue;
	}

	.y {
		color: red;
	}

	.dot {
		background-color: white;
		border: 1px solid fuchsia;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 6px;
		height: 6px;
		transform: translateX(-50%) translateY(-50%);
		border-radius: 50%;
	}
</style>
