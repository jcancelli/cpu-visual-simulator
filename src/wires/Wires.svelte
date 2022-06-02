<script lang="ts">
	import { onMount } from "svelte"
	import Wire from "./Wire"
	import * as Wires from "./Wires"
	import * as Nodes from "./Nodes"
	import { node } from "./Nodes"
	import WireAnimation, * as WireAnimations from "./WireAnimation"

	const animationsCache = new Map<string, WireAnimation>()

	let staticCanvas: HTMLCanvasElement
	let dynamicCanvas: HTMLCanvasElement

	onMount(async () => {
		staticCanvas.width = dynamicCanvas.width = staticCanvas.clientWidth
		staticCanvas.height = dynamicCanvas.height = staticCanvas.clientHeight
		drawStaticWires()
		WireAnimations.setCanvas(dynamicCanvas)
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
			const nodesPath = Nodes.path(from, to)
			const wiresPath = Wires.path(nodesPath)
			animation = new WireAnimation(nodesPath, wiresPath)
			animationsCache.set(fromName + toName, animation)
		}
		await animation.play()
	}

	export function drawStaticWires() {
		const ctx = staticCanvas.getContext("2d")
		ctx.lineWidth = Wire.WIDTH
		ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height)
		for (const wire of Wires.Wires) {
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
