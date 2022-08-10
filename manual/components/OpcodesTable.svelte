<script lang="ts">
	import { opcodes } from "../../src/instruction/Opcode"
	import { numberToBinaryString } from "../../src/util/binaryUtil"
	import text from "../stores/text"
	import Boolean from "./Boolean.svelte"
</script>

<table>
	<tr class="bg-green-300">
		<th colspan="6">
			{$text.opcodes_table.sections_titles.control_flow}
		</th>
	</tr>
	<tr class="bg-green-300">
		<th>{$text.opcodes_table.columns_titles.symbolic}</th>
		<th>{$text.opcodes_table.columns_titles.binary}</th>
		<th>{$text.opcodes_table.columns_titles.numeric}</th>
		<th>{$text.opcodes_table.columns_titles.allows_operand}</th>
		<th>{$text.opcodes_table.columns_titles.allows_immediate}</th>
		<th>{$text.opcodes_table.columns_titles.description}</th>
	</tr>
	{#each opcodes.filter(opcode => opcode.category === "CONTROL_FLOW") as opcode}
		<tr class="bg-green-300">
			<td>{opcode.symbolic}</td>
			<td>{numberToBinaryString(opcode.numeric, 8)}</td>
			<td> {opcode.numeric}</td>
			<td><Boolean value={opcode.takesOperand} /></td>
			<td><Boolean value={opcode.takesImmediate} /></td>
			<td>{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
	<tr class="bg-red-300">
		<th colspan="6">
			{$text.opcodes_table.sections_titles.data_flow}
		</th>
	</tr>
	<tr class="bg-red-300">
		<th>{$text.opcodes_table.columns_titles.symbolic}</th>
		<th>{$text.opcodes_table.columns_titles.binary}</th>
		<th>{$text.opcodes_table.columns_titles.numeric}</th>
		<th>{$text.opcodes_table.columns_titles.allows_operand}</th>
		<th>{$text.opcodes_table.columns_titles.allows_immediate}</th>
		<th>{$text.opcodes_table.columns_titles.description}</th>
	</tr>
	{#each opcodes.filter(opcode => opcode.category === "DATA_FLOW") as opcode}
		<tr class="bg-red-300">
			<td>{opcode.symbolic}</td>
			<td>{numberToBinaryString(opcode.numeric, 8)}</td>
			<td> {opcode.numeric}</td>
			<td><Boolean value={opcode.takesOperand} /></td>
			<td><Boolean value={opcode.takesImmediate} /></td>
			<td>{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
	<tr class="bg-purple-300">
		<th colspan="6">
			{$text.opcodes_table.sections_titles.arithmetic_logic}
		</th>
	</tr>
	<tr class="bg-purple-300">
		<th>{$text.opcodes_table.columns_titles.symbolic}</th>
		<th>{$text.opcodes_table.columns_titles.binary}</th>
		<th>{$text.opcodes_table.columns_titles.numeric}</th>
		<th>{$text.opcodes_table.columns_titles.allows_operand}</th>
		<th>{$text.opcodes_table.columns_titles.allows_immediate}</th>
		<th>{$text.opcodes_table.columns_titles.description}</th>
	</tr>
	{#each opcodes.filter(opcode => opcode.category === "ARITHMETIC_LOGIC") as opcode}
		<tr class="bg-purple-300">
			<td>{opcode.symbolic}</td>
			<td>{numberToBinaryString(opcode.numeric, 8)}</td>
			<td> {opcode.numeric}</td>
			<td><Boolean value={opcode.takesOperand} /></td>
			<td><Boolean value={opcode.takesImmediate} /></td>
			<td>{$text.opcodes_table.descriptions[opcode.symbolic]}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
	}

	td,
	th {
		padding: 0.5rem 1rem;
		text-align: center;
		border-collapse: collapse;
		border-bottom: 1px solid black;
	}
</style>
