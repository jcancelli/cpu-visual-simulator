<script lang="ts">
	import text from "../../stores/text"

	import SubSection from "../SubSection.svelte"
</script>

<SubSection title={$text.sections.introduction.subsections.introduction.title}>
	<p>{$text.sections.introduction.subsections.introduction.text}</p>
</SubSection>
