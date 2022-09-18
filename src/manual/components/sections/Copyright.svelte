<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.copyright.subsections.copyright_notice.title}>
	<div class="mt-36">
		{#each $text.sections.copyright.subsections.copyright_notice.paragraphs as paragraph}
			<p class="text-center">{paragraph}</p>
		{/each}
		<p class="text-center">
			{$text.sections.copyright.subsections.copyright_notice.disclaimer}
			<a
				href="https://www.linkedin.com/in/jonathan-cancelli-4b46b3209"
				target="_blank"
				class="text-blue-700 hover:underline"
			>
				https://www.linkedin.com/in/jonathan-cancelli-4b46b3209
			</a>
		</p>
	</div>
</Section>
