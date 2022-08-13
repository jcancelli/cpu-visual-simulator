<script lang="ts">
	import Instruction from "../../instruction/Instruction"
	import { parseSymbolic } from "../../instruction/instructionParser"
	import { opcodes, SymbolicOpcode, opcode as getOpcode } from "../../instruction/Opcode"
	import Checkbox from "../basic/checkboxes/Debug.svelte"
	import Input from "../basic/inputs/Debug.svelte"
	import Select from "../basic/selects/Debug.svelte"

	export let value: Instruction = parseSymbolic("NOP")

	let symbolicOpcode: SymbolicOpcode = "NOP"
	$: opcode = getOpcode(symbolicOpcode)
	let operand = 0
	let immediate = false
	let error = null

	$: {
		error = null
		try {
			if (opcode.takesOperand) {
				value =
					immediate && opcode.takesImmediate
						? parseSymbolic(`${symbolicOpcode} #${operand}`)
						: parseSymbolic(`${symbolicOpcode} ${operand}`)
			} else {
				value = parseSymbolic(symbolicOpcode)
			}
		} catch (err) {
			error = err.message
		}
	}
</script>

<div class="flex flex-col items-center justify-center gap-1">
	{#if error !== null}
		<p class="text-red-500">{error}</p>
	{/if}
	<div class="flex items-center justify-center gap-1">
		<Select bind:value={symbolicOpcode} options={opcodes.map(opc => opc.symbolic)} />
		<Checkbox bind:checked={immediate} disabled={!opcode.takesOperand || !opcode.takesImmediate}>#</Checkbox>
		<Input class="w-20" type="number" bind:value={operand} disabled={!opcode.takesOperand} />
	</div>
</div>
