import { derived, Readable, writable, Writable } from "../util/customStores"
import Instruction from "../model/Instruction"
import { FIRST_ADDRESS, isValidAddress, LAST_ADDRESS } from "../util/ram"
import { WORD_SIZE } from "../util/cpu"

/** Class that represents the RAM state */
export default class Ram {
	/** Read-only store of the instructions */
	public readonly instructions: Readable<Instruction[]>
	/** Writable store where the instructions are written to */
	protected _instructions: Writable<Instruction[]>

	constructor() {
		this._instructions = writable([])
		this.instructions = derived(this._instructions, $instructions => $instructions)
		this.clear()
	}

	/**
	 * Writes an instruction at the specified address
	 * @param {number} address - The address that will be written
	 * @param {Instruction} instruction - The instruction that will be stored at the specified address
	 */
	write(address: number, instruction: Instruction): void {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		this._instructions.update(oldState => {
			const newState = [...oldState]
			newState[address] = instruction
			return newState
		})
	}

	/**
	 * Returns the instruction stored at the specified address
	 * @param {number} address - The address that will be read
	 * @returns {Instruction} The instruction stored  at the specified address
	 */
	read(address: number): Instruction {
		if (!isValidAddress(address)) {
			throw new Error("Invalid address: " + address)
		}
		return this._instructions.get()[address]
	}

	/** Sets all addresses values to NOP */
	clear(): void {
		const newState: Instruction[] = []
		for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
			newState[address] = Instruction.NOP
		}
		this._instructions.set(newState)
	}

	/**
	 * Replaces all instructions that have the oldLabel as symbolic operand with a new instruction that has newLabel as symbolic operand.
	 * It does NOT alter the actual value of the operand, just its symbolic value
	 * @param {string} oldLabel - The label that should be replaced
	 * @param {string} newLabel - The oldLabel replacement
	 */
	updateLabel(oldLabel: string, newLabel: string): void {
		this._instructions.update(oldState => {
			const newState = [...oldState]
			for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
				const instruction = newState[address]
				if (instruction.symbolicOperand === oldLabel) {
					newState[address] = new Instruction(instruction.symbolicOpcode, newLabel, instruction)
				} else if (instruction.symbolicOperand === `#${oldLabel}`) {
					newState[address] = new Instruction(instruction.symbolicOpcode, `#${newLabel}`, instruction)
				}
			}
			return newState
		})
	}

	/**
	 * Replaces all instructions that have the specified label as symbolic operand with a new instruction that has the numeric value of the operand as symbolic value.
	 * @param {string} label - The label that should be removed
	 */
	removeLabel(label: string): void {
		this._instructions.update(oldState => {
			const newState = [...oldState]
			for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
				const instruction = newState[address]
				if (instruction.symbolicOperand === label) {
					newState[address] = new Instruction(
						instruction.symbolicOpcode,
						instruction.numericOperand().toString(),
						instruction
					)
				} else if (instruction.symbolicOperand === `#${label}`) {
					newState[address] = new Instruction(
						instruction.symbolicOpcode,
						`#${instruction.numericOperand()}`,
						instruction
					)
				}
			}
			return newState
		})
	}

	/**
	 * Overwrites its instance instructions with the instructions of the ram object passed as argument.
	 * Doesn't fire any listener (except for the ones directly subscribed to the instructions store)
	 * @param {Ram} ram - Tha Ram object that should be imported
	 */
	import(ram: Ram): void {
		this._instructions.set([...ram.instructions.get()])
	}

	/**
	 * Shifts all the instructions of address <= of the specified address by -2 addresses (-1 position).
	 * The instruction inside the first address is lost and the instruction that was at the specified address is replaced by a NOP
	 * @param {number} address
	 */
	moveFirstHalfUpFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the instructions of address < of the specified address by +2 addresses (+1 position).
	 * The instruction inside the specified address is overwritten by the one before it and the instruction that was at the first address is replaced by a NOP
	 * @param {number} address
	 */
	moveFirstHalfDownFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the instructions of address > of the specified address by -2 addresses (-1 position).
	 * The instruction inside the specified address is overwritten and the instruction that was at the last address is replaced by a NOP
	 * @param {number} address
	 */
	moveSecondHalfUpFromAddress(address: number): void {
		// TODO
	}

	/**
	 * Shifts all the instructions of address >= of the specified address by +2 addresses (+1 position).
	 * The instruction inside the last address is lost and the instruction that was at the specified address is replaced by a NOP
	 * @param {number} address
	 */
	moveSecondHalfDownFromAddress(address: number): void {
		// TODO
	}

	*[Symbol.iterator]() {
		const instructions = this._instructions.get()
		for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
			yield {
				address,
				instruction: instructions[address]
			}
		}
	}
}
