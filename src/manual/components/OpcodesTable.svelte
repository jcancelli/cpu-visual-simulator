<script lang="ts">
	import { Opcode, opcodes } from "../../app/model/InstructionSet"
	import { IMMEDIATE_FLAG_POS } from "../../app/util/instruction"
	import { numberToBinaryString, setBit } from "../../app/util/binary"
	import text from "../stores/text"

	function direct(opcode: Opcode): string {
		let symbolic = opcode.symbolic
		if (opcode.takesOperand) {
			symbolic += " X"
		}
		let binary = numberToBinaryString(opcode.numeric, 8)
		return `${symbolic} ${binary}`
	}

	function immediate(opcode: Opcode): string {
		if (!opcode.takesImmediate) {
			return ""
		}
		let symbolic = `${opcode.symbolic} #X`
		return `${symbolic} ${binaryOpcodeWithImmediateFlagSet(opcode.numeric)}`
	}

	function binaryOpcodeWithImmediateFlagSet(opcode: number): string {
		return setBit(numberToBinaryString(opcode, 8), IMMEDIATE_FLAG_POS, true)
	}
</script>

<table class="text-center border-collapse shadow-lg {$$props.class}">
	<tr class="bg-green-300">
		<th colspan="3">
			{$text.opcodes_table.sections_titles.control_flow}
		</th>
	</tr>
	<!-- colgroup is in this position the last-child and first-child selectors works properly -->
	<colgroup>
		<col class="w-32 rounded-t" />
		<col class="w-32" />
		<col class="w-[40rem] text-left" />
	</colgroup>
	{#each opcodes.filter(opcode => opcode.category === "CONTROL_FLOW") as opcode}
		<tr class="bg-green-200">
			<td>{direct(opcode)}</td>
			<td>{immediate(opcode)}</td>
			<td class="text-left">{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
	<tr class="bg-red-300">
		<th colspan="3">
			{$text.opcodes_table.sections_titles.data_flow}
		</th>
	</tr>
	{#each opcodes.filter(opcode => opcode.category === "DATA_FLOW") as opcode}
		<tr class="bg-red-200">
			<td>{direct(opcode)}</td>
			<td>{immediate(opcode)}</td>
			<td class="text-left">{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
	<tr class="bg-purple-300">
		<th colspan="3">
			{$text.opcodes_table.sections_titles.arithmetic_logic}
		</th>
	</tr>
	{#each opcodes.filter(opcode => opcode.category === "ARITHMETIC_LOGIC") as opcode}
		<tr class="bg-purple-200">
			<td>{direct(opcode)}</td>
			<td>{immediate(opcode)}</td>
			<td class="text-left">{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
</table>

<style>
	td,
	th {
		padding: 0.5rem 1rem;
		border-bottom: 0.05em solid black;
	}

	tr:first-child th {
		border-top-left-radius: 0.7rem;
		border-top-right-radius: 0.7rem;
	}

	tr:last-child td {
		border: 0;
	}

	tr:last-child td:first-child {
		border-bottom-left-radius: 0.5rem;
	}

	tr:last-child td:last-child {
		border-bottom-right-radius: 0.5rem;
	}
</style>
