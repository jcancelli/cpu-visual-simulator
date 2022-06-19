<script lang="ts">
	import Stage from "./components/Stage.svelte"
	import Debugger from "./components/debug/Debugger.svelte"
	import MessageFeed from "./components/MessageFeed.svelte"
	import { controls, debug, messageFeed, logger, menu } from "./store/components"
	import { onMount } from "svelte"
	import LoggerComponent from "./components/debug/Logger.svelte"
	import Logger from "./util/Logger"
	import Controls from "./components/controls/Controls.svelte"
	import Menu from "./components/menu/Menu.svelte"

	let app: HTMLDivElement

	function scale() {
		const width = 1400,
			height = 800
		let widthRatio = window.innerWidth / width
		let heightRatio = window.innerHeight / height
		let scale = widthRatio < heightRatio ? widthRatio : heightRatio
		app.style.transform = `scale(${scale})`
	}

	function logError(e: Event) {
		e.preventDefault()
		Logger.error((e as ErrorEvent).error, "UNCAUGHT")
	}

	onMount(scale)
</script>

<svelte:window on:resize={scale} on:error={logError} />
<div class="relative w-app h-app origin-top-left" bind:this={app}>
	<Stage />
	<Controls bind:this={$controls} />
	<Menu bind:this={$menu} />
</div>
<Debugger bind:this={$debug} />
<LoggerComponent bind:this={$logger} />
<MessageFeed bind:this={$messageFeed} />

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
