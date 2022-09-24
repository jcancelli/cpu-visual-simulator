<script lang="ts">
	import { onMount } from "svelte"
	import Wire from "./Wire"
	import * as Wires from "./Wires"
	import * as Nodes from "./Nodes"
	import WireAnimation, * as WireAnimations from "./WireAnimation"
	import BusLabel from "../components/labels/Bus.svelte"
	import {
		extDataBusColor,
		intDataBusColor,
		extAddressBusColor,
		intAddressBusColor,
		extControlBusColor,
		intControlBusColor
	} from "../store/settings"
	import { showNodes } from "../store/debug"
	import NodeMarker from "./NodeMarker.svelte"

	export let animationsEnabled: boolean

	const animationsCache = new Map<string, WireAnimation>()

	let staticCanvas: HTMLCanvasElement
	let dynamicCanvas: HTMLCanvasElement

	onMount(async () => {
		staticCanvas.width = dynamicCanvas.width = 1400
		staticCanvas.height = dynamicCanvas.height = 800
		drawStaticWires()
		WireAnimations.setCanvas(dynamicCanvas)
		// redraw static wires if one of their color is changed
		extDataBusColor.subscribe(newValue => drawStaticWires())
		intDataBusColor.subscribe(newValue => drawStaticWires())
		extAddressBusColor.subscribe(newValue => drawStaticWires())
		intAddressBusColor.subscribe(newValue => drawStaticWires())
		extControlBusColor.subscribe(newValue => drawStaticWires())
		intControlBusColor.subscribe(newValue => drawStaticWires())
	})

	export async function flashWire(fromName: string, toName: string): Promise<void> {
		if (!animationsEnabled) return
		const from = Nodes.node(fromName),
			to = Nodes.node(toName)
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

	export function drawStaticWires(): void {
		const ctx = staticCanvas.getContext("2d")
		ctx.lineWidth = Wire.WIDTH
		ctx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height)
		for (const wire of Wires.Wires) {
			ctx.strokeStyle = wire.type.color()
			ctx.beginPath()
			ctx.moveTo(wire.a.x, wire.a.y)
			ctx.lineTo(wire.b.x, wire.b.y)
			ctx.stroke()
		}
		for (const node of Nodes.Nodes.filter(n => n.intersectionType !== null)) {
			const halfSize = Wire.WIDTH / 2 - 0.5
			ctx.beginPath()
			ctx.fillStyle = node.intersectionType.color()
			ctx.arc(node.x, node.y, halfSize, 0, Math.PI * 2)
			ctx.fill()
		}
	}
</script>

<canvas class="absolute z-[2] top-0 left-0 w-app h-app" bind:this={staticCanvas} />
<canvas class="absolute z-[2] top-0 left-0 w-app h-app" bind:this={dynamicCanvas} />
<BusLabel bus="DATA" top="62px" left="850px" />
<BusLabel bus="ADDRESS" top="226px" left="837px" />
<BusLabel bus="CONTROL" top="346px" left="838px" />
{#if $showNodes}
	{#each Nodes.Nodes as node}
		<NodeMarker {node} />
	{/each}
{/if}
