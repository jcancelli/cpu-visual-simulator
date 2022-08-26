<script lang="ts">
	import text from "../../stores/text"
	import OpcodesTable from "../OpcodesTable.svelte"
	import SubSection from "../SubSection.svelte"
</script>

<SubSection title={$text.sections.instruction_set.subsections.instruction_set.title}>
	<OpcodesTable class="mx-auto" />
</SubSection>
