<script lang="ts">
	import { opcodes } from "../../src/instruction/Opcode"
	import BinaryValue from "../../src/util/BinaryValue"
</script>

<table>
	<tr class="bg-green-300"><th colspan="5">Control flow</th></tr>
	<tr class="bg-green-300">
		<th>Symbolic opcode</th>
		<th>Binary opcode</th>
		<th>Numeric value</th>
		<th>Allows operand</th>
		<th>Allows immediate operand</th>
	</tr>
	{#each opcodes.filter(o => o.category === "CONTROL_FLOW") as opcode}
		<tr class="bg-green-300">
			<td>{opcode.symbolic}</td>
			<td>{new BinaryValue(8, opcode.numeric).toBinaryString()}</td>
			<td> {opcode.numeric}</td>
			<td>{opcode.takesOperand ? "yes" : "no"}</td>
			<td>{opcode.takesImmediate ? "yes" : "no"}</td>
		</tr>
	{/each}
	<tr class="bg-red-300"><th colspan="5">Data flow</th></tr>
	<tr class="bg-red-300">
		<th>Symbolic opcode</th>
		<th>Binary opcode</th>
		<th>Numeric value</th>
		<th>Allows operand</th>
		<th>Allows immediate operand</th>
	</tr>
	{#each opcodes.filter(o => o.category === "DATA_FLOW") as opcode}
		<tr class="bg-red-300">
			<td>{opcode.symbolic}</td>
			<td>{new BinaryValue(8, opcode.numeric).toBinaryString()}</td>
			<td> {opcode.numeric}</td>
			<td>{opcode.takesOperand ? "yes" : "no"}</td>
			<td>{opcode.takesImmediate ? "yes" : "no"}</td>
		</tr>
	{/each}
	<tr class="bg-purple-300"><th colspan="5">Arithmetic-logic</th></tr>
	<tr class="bg-purple-300">
		<th>Symbolic opcode</th>
		<th>Binary opcode</th>
		<th>Numeric value</th>
		<th>Allows operand</th>
		<th>Allows immediate operand</th>
	</tr>
	{#each opcodes.filter(o => o.category === "ARITHMETIC_LOGIC") as opcode}
		<tr class="bg-purple-300">
			<td>{opcode.symbolic}</td>
			<td>{new BinaryValue(8, opcode.numeric).toBinaryString()}</td>
			<td> {opcode.numeric}</td>
			<td>{opcode.takesOperand ? "yes" : "no"}</td>
			<td>{opcode.takesImmediate ? "yes" : "no"}</td>
		</tr>
	{/each}
</table>

<style>
	table {
		border-collapse: collapse;
	}
	td,
	th {
		border: 1px solid black;
		padding: 1rem;
	}
</style>
