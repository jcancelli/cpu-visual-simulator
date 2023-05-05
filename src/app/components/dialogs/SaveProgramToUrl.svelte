<script lang="ts">
	import { Dialog, DialogOverlay, DialogTitle } from "@rgossiaux/svelte-headlessui"
	import { ramStore, symbolTableStore } from "../../store/state"
	import { exportProgram } from "../../util/programParser"
	import { createEventDispatcher } from "svelte"
	import BlueButton from "../../../shared/components/buttons/Blue.svelte"
	import text from "../../store/text"

	const dispatch = createEventDispatcher()

	export let open: boolean

	let url: URL

	let isCopied = false

	$: {
		if (open) {
			url = new URL(window.location.href.split("?")[0])
			url.searchParams.append("program", window.btoa(exportProgram($ramStore, $symbolTableStore)))
		}
	}

	function onClose(): void {
		isCopied = false
		dispatch("close")
	}

	function copyUrlToClipboard(): void {
		navigator.clipboard.writeText(url.href)
		isCopied = true
	}
</script>

<Dialog {open} on:close={onClose}>
	<DialogOverlay class="fixed top-0 left-0 bg-black/40 w-screen h-screen" />
	<div
		class="
			fixed
			top-[50vh]
			left-[50vw]
			-translate-x-2/4
			-translate-y-2/4
			bg-white
			flex
			flex-col
			items-center
			justify-center
			gap-4
			p-6
			rounded-lg
			shadow-lg
		"
	>
		<DialogTitle>{$text.menu.overlays.save_to_url.title}</DialogTitle>
		<div class="flex flex-col items-center justify-center gap-3">
			<textarea value={url.href} disabled={true} class="w-64 h-40" />
			{#if isCopied}
				<p class="text-green-500 font-semibold drop-shadow">{$text.menu.overlays.save_to_url.copied}</p>
			{/if}
			<BlueButton
				title={$text.menu.overlays.save_to_url.buttons.copy_to_clipboard.title}
				on:click={copyUrlToClipboard}
			>
				{$text.menu.overlays.save_to_url.buttons.copy_to_clipboard.text}
			</BlueButton>
		</div>
	</div>
</Dialog>
