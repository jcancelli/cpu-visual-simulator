<script lang="ts">
	import Section from "../Section.svelte"
	import text from "../../stores/text"
</script>

<Section title={$text.sections.code_files.subsections.code_files.title}>
	{#each $text.sections.code_files.subsections.code_files.paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
</Section>
<Section title={$text.sections.code_files.subsections.new_lines.title}>
	{#each $text.sections.code_files.subsections.new_lines.paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
</Section>
<Section title={$text.sections.code_files.subsections.syntax.title}>
	{#each $text.sections.code_files.subsections.syntax.paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
</Section>
