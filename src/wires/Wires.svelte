<script lang="ts">
	import { onMount } from "svelte"
	import { WIDTH as wireWidth } from "./Wire"
	import { Wires } from "./Wires"
	import { path as nodesPath } from "./Node"
	import { node } from "./Nodes"
	import WireAnimation, { init as initWireAnimation } from "./WireAnimation"

	const animationsCache = new Map<string, WireAnimation>()

	let staticCanvas: HTMLCanvasElement
	let dynamicCanvas: HTMLCanvasElement
	let swapCanvas: HTMLCanvasElement

	onMount(async () => {
		staticCanvas.width = dynamicCanvas.width = swapCanvas.width = staticCanvas.clientWidth
		staticCanvas.height = dynamicCanvas.height = swapCanvas.height = staticCanvas.clientHeight
		swapCanvas.getContext("2d").globalAlpha = 0.8
		initWireAnimation(dynamicCanvas, swapCanvas)
		drawStaticWires()
	})

	export async function flashWire(fromName: string, toName: string): Promise<void> {
		const from = node(fromName),
			to = node(toName)
		if (!from) throw new Error("Node " + fromName + " is undefined")
		if (!to) throw new Error("Node " + toName + " is undefined")
		let animation: WireAnimation
		if ((animation = animationsCache.get(fromName + toName))) {
			animation.reset()
		} else {
			animation = new WireAnimation(nodesPath(from, to))
			animationsCache.set(fromName + toName, animation)
		}
		await animation.play()
	}

	function drawStaticWires() {
		const ctx = staticCanvas.getContext("2d")
		ctx.lineWidth = wireWidth
		for (const wire of Wires) {
			ctx.lineCap = wire.linecap ? "square" : "butt"
			ctx.strokeStyle = wire.type.color
			ctx.beginPath()
			ctx.moveTo(wire.a.x, wire.a.y)
			ctx.lineTo(wire.b.x, wire.b.y)
			ctx.stroke()
		}
	}
</script>

<div class="wires">
	<canvas class="static" bind:this={staticCanvas} />
	<canvas class="dynamic" bind:this={dynamicCanvas} />
	<canvas class="swap" bind:this={swapCanvas} hidden />
</div>

<style lang="scss">
	@import "../style/variables.scss";

	.wires,
	.static,
	.dynamic {
		position: absolute;
		width: $stage-width;
		height: $stage-height;
		left: $stage-x;
		top: $stage-y;
		z-index: 2;
	}
</style>
