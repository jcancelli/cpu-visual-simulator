<script lang="ts">
	import text from "../../stores/text"
	import CodeBlock from "../CodeBlock.svelte"
	import OpcodesTable from "../OpcodesTable.svelte"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.instruction_set.subsections.instruction_set.title} h={2}>
	<OpcodesTable class="mx-auto" />
</Section>

<Section title={$text.sections.instruction_set.subsections.instruction_structure.title} h={2}>
	<div class="flex flex-wrap itmes-center justify-evenly">
		<div class="p-1 mb-7">
			<div class="w-fit px-7 py-4 mx-auto text-3xl flex items-center justify-center rounded-lg bg-gray-500">
				<div class="flex flex-col items-center text-green-700">
					<div>ADD</div>
					<div class="text-2xl">A</div>
				</div>
				<div class="flex flex-col items-center ml-2 text-cyan-300">
					<div>#</div>
					<div class="text-2xl">B</div>
				</div>
				<div class="flex flex-col items-center text-red-500">
					<div>22</div>
					<div class="text-2xl">C</div>
				</div>
			</div>
			<div class="mx-auto mt-7 flex flex-col items-start justify-center gap-1 w-fit">
				<p class="">
					<span
						class="bg-gray-500 text-green-700 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>A</span
					>
					Opcode - {$text.sections.instruction_set.subsections.instruction_structure.opcode_desc}
				</p>
				<p class="">
					<span
						class="bg-gray-500 text-cyan-300 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>B</span
					>
					Immediate Flag - {$text.sections.instruction_set.subsections.instruction_structure
						.immediate_flag_desc}
				</p>
				<p class="">
					<span
						class="bg-gray-500 text-red-500 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>C</span
					>
					Operand - {$text.sections.instruction_set.subsections.instruction_structure.operand_desc}
				</p>
			</div>
		</div>
		<div class="p-1">
			<div class="w-fit px-7 py-4 mx-auto text-3xl flex items-center justify-center rounded-lg bg-gray-500">
				<div class="flex flex-col items-center text-cyan-300">
					<div>0</div>
					<div class="text-2xl">A</div>
				</div>
				<div class="flex flex-col items-center text-green-700">
					<div>0000000</div>
					<div class="text-2xl">B</div>
				</div>
				<div class="flex flex-col items-center ml-2 text-red-500">
					<div>00000000</div>
					<div class="text-2xl">C</div>
				</div>
			</div>
			<div class="mx-auto mt-7 flex flex-col items-start justify-center gap-1 w-fit">
				<p class="">
					<span
						class="bg-gray-500 text-cyan-300 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>A</span
					>
					Immediate Flag - {$text.sections.instruction_set.subsections.instruction_structure
						.immediate_flag_desc}
				</p>
				<p class="">
					<span
						class="bg-gray-500 text-green-700 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>B</span
					>
					Opcode - {$text.sections.instruction_set.subsections.instruction_structure.opcode_desc}
				</p>
				<p class="">
					<span
						class="bg-gray-500 text-red-500 py-2 px-3 text-xl box-border inline-block w-fit shadow-md rounded-md"
						>C</span
					>
					Operand - {$text.sections.instruction_set.subsections.instruction_structure.operand_desc}
				</p>
			</div>
		</div>
	</div>
</Section>

<Section title={$text.sections.instruction_set.subsections.addressing_modes.title} h={2}>
	<Section
		title={$text.sections.instruction_set.subsections.addressing_modes.subsections.immediate.title}
		h={3}
	>
		{#each $text.sections.instruction_set.subsections.addressing_modes.subsections.immediate.paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
		<!-- prettier-ignore -->
		<CodeBlock class="text-base mt-3 px-6">
LOD #120
MUL #-1
LOD #LABEL
		</CodeBlock>
	</Section>
	<Section title={$text.sections.instruction_set.subsections.addressing_modes.subsections.direct.title} h={3}>
		{#each $text.sections.instruction_set.subsections.addressing_modes.subsections.direct.paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
		<!-- prettier-ignore -->
		<CodeBlock class="text-base mt-3 px-6">
MUL 22
DIV LABEL
		</CodeBlock>
	</Section>
</Section>
