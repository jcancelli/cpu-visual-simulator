<script lang="ts">
	import { Dialog, DialogOverlay } from "@rgossiaux/svelte-headlessui"
	import MenuItem from "../MenuItem.svelte"
	import CloseButton from "../../../../shared/components/buttons/CloseButton.svelte"
	import logger, { LogCategory } from "../../../util/logger"
	import text from "../../../store/text"

	let showDialog = false

	function openDialog(): void {
		showDialog = true
		logger.debug("Copyright notice opened", LogCategory.USER_INPUT)
	}

	function closeDialog(): void {
		showDialog = false
		logger.debug("Copyright notice closed", LogCategory.USER_INPUT)
	}
</script>

<button on:click={openDialog}>
	<MenuItem
		text={$text.menu.buttons.copyright.text}
		title={$text.menu.buttons.copyright.title}
		icon="copyright"
	/>
</button>

<Dialog open={showDialog} on:close={closeDialog}>
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
				p-10
				rounded-2xl
				shadow-lg
			"
	>
		<CloseButton class="absolute top-3 right-3" on:click={closeDialog} size={30} />
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
					rel="noreferrer"
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
					rel="noreferrer"
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
