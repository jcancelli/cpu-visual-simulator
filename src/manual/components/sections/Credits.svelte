<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.credits.subsections.credits.title}>
	{#each $text.sections.credits.subsections.credits.paragraphs as paragraph}
		<p class="mb-4">{paragraph}</p>
	{/each}
	<p class="mb-2">
		[1]
		<a
			href="https://www.ppig.org/files/2021-PPIG-32nd-DC-cortinovis.pdf"
			target="_blank"
			class="text-blue-700 hover:underline"
		>
			Cortinovis, R., and Rajan, R. (2022) Evaluating and improving the Educational CPU Visual Simulator: a
			sustainable Open Pedagogy approach. Proceedings of the 33rd Annual Workshop of the Psychology of
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
			Cortinovis, R. (2021) An Educational CPU Visual Simulator. Proceedings of the 32nd Annual Workshop of
			the Psychology of Programming Interest Group (PPIG), York, United Kingdom.
		</a>
	</p>
</Section>
