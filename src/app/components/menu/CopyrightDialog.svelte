<script lang="ts">
	import { Dialog, DialogOverlay, DialogTitle } from "@rgossiaux/svelte-headlessui"
	import { createEventDispatcher } from "svelte"
	import BlueButton from "../../../shared/components/buttons/Blue.svelte"
	import GrayButton from "../../../shared/components/buttons/Gray.svelte"
	import { download } from "../../../shared/util/file"
	import { ramStore, symbolTableStore } from "../../store/state"
	import text from "../../store/text"
	import { exportProgram } from "../../util/programParser"
	import Logger from "../../util/logger"
	import CloseButton from "../../../shared/components/buttons/CloseButton.svelte"

	const dispatch = createEventDispatcher()

	export let open: boolean

	function onClose() {
		dispatch("close")
	}
</script>

<Dialog {open} on:close={onClose}>
	<DialogOverlay class="fixed top-0 left-0 bg-black/40 w-screen h-screen" />
	<div
		class="
			fixed
			top-[50vh]
			left-[50vw]
			max-h-screen
			max-w-screen
			overflow-auto
			-translate-x-2/4
			-translate-y-2/4
			bg-white
			flex
			flex-col
			items-center
			justify-center
			gap-6
			p-8
			rounded-lg
			shadow-lg
		"
	>
		<CloseButton class="absolute top-2 right-2" on:click={onClose} />
		<div class="text-center">
			<h2 class="text-lg font-semibold mb-2">
				{$text.menu.overlays.copyright.subsections.copyright_notice.title}
			</h2>
			{#each $text.menu.overlays.copyright.subsections.copyright_notice.paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
			<p class="mt-2">
				{$text.menu.overlays.copyright.subsections.copyright_notice.disclaimer}
				<a
					href="https://www.linkedin.com/in/jonathan-cancelli-4b46b3209"
					target="_blank"
					class="text-blue-700 hover:underline"
				>
					LinkedIn
				</a>
			</p>
		</div>
		<div class="text-center">
			<h2 class="text-lg font-semibold mb-2">{$text.menu.overlays.copyright.subsections.credits.title}</h2>
			{#each $text.menu.overlays.copyright.subsections.credits.paragraphs as paragraph}
				<p class="mb-4">{paragraph}</p>
			{/each}
			<p class="mb-2">
				[1]
				<a
					href="https://www.ppig.org/files/2021-PPIG-32nd-DC-cortinovis.pdf"
					target="_blank"
					class="text-blue-700 hover:underline"
				>
					Cortinovis, R., and Rajan, R. (2022) Evaluating and improving the Educational CPU Visual Simulator:
					a sustainable Open Pedagogy approach. Proceedings of the 33rd Annual Workshop of the Psychology of
					Programming Interest Group (PPIG), Milton Keynes, United Kingdom.
				</a>
			</p>
			<p>
				[2]
				<a
					href="resources/papers/evaluating_and_improving_the_educational_cpu_visual_simulator_a_sustainable_open_pedagogy_approach.pdf"
					target="_blank"
					class="text-blue-700 hover:underline"
				>
					Cortinovis, R. (2021) An Educational CPU Visual Simulator. Proceedings of the 32nd Annual Workshop
					of the Psychology of Programming Interest Group (PPIG), York, United Kingdom.
				</a>
			</p>
		</div>
	</div>
</Dialog>
