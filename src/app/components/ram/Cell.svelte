<script lang="ts">
	import ram from "../../store/ram"
	import { parseBinary, parseSymbolic } from "../../instruction/instructionParser"
	import { messageFeed } from "../../store/components"
	import { flash as flashComponent } from "../../util/animation"
	import ramSelection from "../../store/ramSelection"
	import Logger from "../../util/logger"
	import { displayAsBinary } from "../../store/settings"
	import symbolTable from "../../store/symbolTable"
	import Instruction from "../../instruction/Instruction"

	export let address: number
	export let instruction: Instruction
	export let isSelected: boolean

	$: opcode = $displayAsBinary ? instruction.binaryOpcode() : instruction.symbolicOpcode
	$: operand = $displayAsBinary ? instruction.binaryOperand() : instruction.symbolicOperand

	$: onSelectedChange(isSelected)
	$: onInstructionChange(instruction)
	$: onAddressChange(address)

	let cell: HTMLDivElement

	let inputValue: string

	export async function flash(): Promise<void> {
		return flashComponent(cell, "background-color", { r: 211, g: 211, b: 211 }, { r: 0, g: 255, b: 0 })
	}

	export function getAddress(): number {
		return address
	}

	function commitEdit(): void {
		try {
			if (inputValue !== "") {
				Logger.info(`RamCell input: "${inputValue}"`, "USER_INPUT")
				if ($displayAsBinary) {
					ram.write(address, parseBinary(inputValue.trim()))
				} else {
					ram.write(address, parseSymbolic(inputValue.trim(), $symbolTable))
				}
			}
		} catch (error) {
			$messageFeed?.error(error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
		} finally {
			deselect()
		}
	}

	function select(): void {
		ramSelection.select(address, "CELL")
	}

	function deselect(): void {
		if (ramSelection.isSelected(address, "CELL")) {
			ramSelection.deselect()
		}
	}

	function onAddressChange(newAddress: number): void {
		inputValue = opcode + (operand ? ` ${operand}` : "")
	}

	function onInstructionChange(newInstruction: Instruction): void {
		inputValue = opcode + (operand ? ` ${operand}` : "")
	}

	function onSelectedChange(isNowSelected: boolean): void {
		if (isNowSelected) {
			inputValue = opcode + (operand ? ` ${operand}` : "")
		}
	}

	function formatInput(): void {
		inputValue = inputValue.toUpperCase().replace(/[^A-Z0-9 _\-#\(\)]*/g, "")
	}

	function focus(node: HTMLElement): void {
		node.focus()
	}

	function highlightText(node: HTMLInputElement): void {
		setTimeout(() => node.select())
	}
</script>

<div
	class="
		h-[30px]
		w-[190px]
		grid
		grid-cols-2
		items-center
		bg-gray-200
		cursor-text
		border
		border-black
		border-t-0
		border-l-0
		{$$restProps.class}
	"
	on:click={select}
	bind:this={cell}
>
	{#if isSelected}
		<input
			bind:value={inputValue}
			on:focusout={commitEdit}
			on:input={formatInput}
			use:focus
			use:highlightText
			class="
				h-[30px]
				w-[190px]
				p-0
				pl-[10px]
				border-0
				col-span-1
				outline-none
				bg-black
				text-gray-200
				selection:bg-transparent
			"
		/>
	{:else}
		<div class="h-[30px] w-[190px] flex items-center justify-start pl-[10px]">{opcode}</div>
		{#if operand}
			<div class="h-[30px] w-[190px] flex items-center justify-start overflow-hidden">
				{operand}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.first-cell {
		border-radius: 0 16px 0 0;
		border-top-width: 1px;

		input {
			border-radius: 0 16px 0 0;
		}
	}

	.last-cell {
		border-radius: 0 0 16px 0;

		input {
			border-radius: 0 0 16px 0;
		}
	}
</style>
