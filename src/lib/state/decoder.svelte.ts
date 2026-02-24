import type { SubmitTasksFunction } from "$lib/execution/action_handler"
import { executeOpcode, type DecodeOpcodeAction } from "$lib/execution/actions/cpu"
import { endStep } from "$lib/execution/actions/execution"
import { INVALID_OPCODE_ACTIONS } from "$lib/execution/steps_actions"
import type { U8 } from "$lib/types/integer"
import { getImmediateFlag, getOpcodeByNumeric, OPCODE_NOP, type Opcode } from "$lib/types/opcode"
import { type Bus } from "./bus.svelte"

/** State of the decoder */
export class Decoder {
	/** The numeric value of the undecoded opcode */
	private rawOpcode: U8
	/** The last successfully decoded opcode. If {@link Decoder.decodeSuccess} is false this value should be considerer invlid */
	private _decodedOpcode: Opcode
	/** The immediate flag value that was decoded from the value sent by the instruction register */
	private _decodedImmediateFlag: boolean
	/** The last decoded opcode was valid */
	private _decodeSuccess: boolean
	/** The bus connected to the instruction register */
	private opcodeBus: Bus<8>

	constructor(opcodeBus: Bus<8>) {
		this.rawOpcode = $state(0 as U8)
		this._decodedOpcode = $state(OPCODE_NOP)
		this._decodedImmediateFlag = $state(false)
		this._decodeSuccess = $state(true)
		this.opcodeBus = opcodeBus
	}

	/** The last successfully decoded opcode. If {@link Decoder.decodeSuccess} is false this value should be considerer invlid */
	get decodedOpcode(): Opcode {
		return this._decodedOpcode
	}

	/** The immediate flag value that was decoded from the value sent by the instruction register */
	get decodedImmediateFlag(): boolean {
		return this._decodedImmediateFlag
	}

	/** The last decoded opcode was valid */
	get decodeSuccess(): boolean {
		return this._decodeSuccess
	}

	/** Read the numeric value of the opcode from the bus connected to the instruction register.
	 * @throws {NoSignalError} */
	readOpcodeSignal(): void {
		this.rawOpcode = this.opcodeBus.readSignalUnsignedOrThrow()
	}

	/** Decode the opcode associated with the numeric value previously read from the bus connected to the instruction register */
	handleDecodeOpcodeAction(_: DecodeOpcodeAction, submitTasks: SubmitTasksFunction): boolean {
		const opcode = getOpcodeByNumeric(this.rawOpcode)
		this._decodedImmediateFlag = getImmediateFlag(this.rawOpcode)
		if (opcode !== undefined) {
			this._decodedOpcode = opcode
		}
		this._decodeSuccess = opcode !== undefined
		// Make sure to end the decode opcode step
		submitTasks(endStep)
		// Submit task to continue the execution
		if (!this._decodeSuccess) {
			submitTasks(...INVALID_OPCODE_ACTIONS)
		} else {
			submitTasks(executeOpcode)
		}
		return true
	}
}
