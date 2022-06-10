<script lang="ts">
	import Stage from "./components/Stage.svelte"
	import ControlBar from "./components/ControlBar.svelte"
	import Debugger from "./components/Debugger.svelte"
	import MessageFeed from "./components/MessageFeed.svelte"
	import { controlBar, debug, messageFeed, logger } from "./store/componentsStore"
	import { onMount } from "svelte"
	import Logger from "./components/Logger.svelte"

	let app: HTMLDivElement

	function scale() {
		const width = 1400,
			height = 800
		let widthRatio = window.innerWidth / width
		let heightRatio = window.innerHeight / height
		let scale = widthRatio < heightRatio ? widthRatio : heightRatio
		app.style.transform = `scale(${scale})`
	}

	onMount(scale)
</script>

<svelte:window on:resize={scale} />
<div class="app" bind:this={app}>
	<Stage />
	<ControlBar bind:this={$controlBar} />
</div>
<Debugger bind:this={$debug} />
<Logger bind:this={$logger} />
<MessageFeed bind:this={$messageFeed} />

<style lang="scss">
	@import "./style/variables.scss";

	.app {
		position: relative;
		width: $global-width;
		height: $global-height;
		transform-origin: left top;
	}
</style>
