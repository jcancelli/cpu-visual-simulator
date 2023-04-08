<script lang="ts">
	import { ramStore } from "../../store/state"
	import { messageFeedStore } from "../../store/state"
	import ramSelection from "../../store/ramSelection"
	import { animationsEnabled, displayAsBinary } from "../../store/settings"
	import { parseBinary, parseSymbolic } from "../../util/instructionParser"
	import { flash as flashComponent } from "../../util/animation"
	import logger, { LogCategory } from "../../util/logger"
	import Instruction from "../../model/Instruction"
	import SymbolTable from "../../model/SymbolTable"
	import { Color } from "../../util/colors"

	export let symbolTable: SymbolTable
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
		if (!$animationsEnabled) return
		return flashComponent(cell, "background-color", Color.GREEN)
	}

	export function getAddress(): number {
		return address
	}

	function commitEdit(): void {
		try {
			if (inputValue !== "") {
				logger.debug(`RamCell input: "${inputValue}"`, LogCategory.USER_INPUT)
				if ($displayAsBinary) {
					$ramStore.write(address, parseBinary(inputValue.trim()))
				} else {
					$ramStore.write(address, parseSymbolic(inputValue.trim(), symbolTable))
				}
			}
		} catch (error) {
			$messageFeedStore?.error(error.message)
			logger.handled_error(error.message, LogCategory.USER_INPUT)
		} finally {
			deselect()
		}
	}

	function select(): void {
		logger.debug(`Cell selected - Address: "${address}"`, LogCategory.USER_INPUT)
		ramSelection.select(address, "CELL")
	}

	function deselect(): void {
		if (ramSelection.isSelected(address, "CELL")) {
			logger.debug(`Cell deselected - Address: "${address}"`, LogCategory.USER_INPUT)
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
		font-mono
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
		<div class="h-[30px] w-[95px] leading-[30px] text-left pl-[10px]">{opcode}</div>
		{#if operand}
			<div
				class="h-[30px] w-[95px] min-w-0 leading-[30px] text-left overflow-hidden text-ellipsis whitespace-nowrap"
			>
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
