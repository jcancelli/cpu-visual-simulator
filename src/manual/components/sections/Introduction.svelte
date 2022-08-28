<script lang="ts">
	import text from "../../stores/text"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.introduction.subsections.introduction.title}>
	<p>{$text.sections.introduction.subsections.introduction.text}</p>
</Section>
