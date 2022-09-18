<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.copyright.subsections.copyright_notice.title}>
	{#each $text.sections.copyright.subsections.copyright_notice.paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
	<p>
		{$text.sections.copyright.subsections.copyright_notice.disclaimer}
		<a
			href="https://www.linkedin.com/in/jonathan-cancelli-4b46b3209"
			target="_blank"
			class="text-blue-700 hover:underline"
		>
			LinkedIn
		</a>
	</p>
</Section>
