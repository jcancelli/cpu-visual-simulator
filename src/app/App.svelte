<script lang="ts">
	import Stage from "./components/Stage.svelte"
	import Debugger from "./components/debug/Debugger.svelte"
	import MessageFeed from "./components/messages/Feed.svelte"
	import { controls, debug, messageFeed, logger, menu, settings } from "./store/components"
	import { onMount } from "svelte"
	import LoggerComponent from "./components/debug/Logger.svelte"
	import Logger from "./util/logger"
	import Controls from "./components/controls/Controls.svelte"
	import Menu from "./components/menu/Menu.svelte"
	import Settings from "./components/settings/Settings.svelte"
	import text from "./store/text"

	let app: HTMLDivElement

	function scale() {
		const width = 1400
		const height = 800
		let widthRatio = window.innerWidth / width
		let heightRatio = window.innerHeight / height
		let scale = widthRatio < heightRatio ? widthRatio : heightRatio
		app.style.transform = `scale(${scale})`
	}

	function logError(e: Event) {
		e.preventDefault()
		Logger.error(new Error($text.errors.unchecked), "UNCAUGHT")
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
<Settings bind:this={$settings} />

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
