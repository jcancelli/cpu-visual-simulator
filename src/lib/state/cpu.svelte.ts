import {
	BusID,
	ReadSignalBusAction,
	Register,
	SetMemoryOperationAction,
	type SendSignalBusAction,
} from "$lib/execution/action"
import {
	type ActionHandlerResult,
	ACTION_HANDLED,
	ACTION_UNHANDLED,
	type ActionConsumer,
	ActionHandlerMap,
} from "$lib/execution/action_performer"
import { ActionType } from "$lib/execution/task"
import { todo } from "$lib/util/development"
import type { EnumCombinationMap } from "$lib/util/types"
import { InstructionRegister } from "./instruction_register.svelte"
import { ProgramCounter } from "./program_counter.svelte"
import { Decoder } from "./decoder.svelte"
import { ControlUnit } from "./control_unit.svelte"
import { Multiplexer } from "./multiplexer.svelte"
import { ArithmeticLogicUnit } from "./arithmetic_logic_unit.svelte"
import { Accumulator } from "./accumulator.svelte"
import { StatusWord } from "./status_word.svelte"
import type { Bus } from "./bus.svelte"

/** Actions handled by the {@link CPU} */
export type CPUHandledAction =
	| ActionType.SEND_SIGNAL
	| ActionType.READ_SIGNAL
	| ActionType.DECODE_INSTRUCTION
	| ActionType.EXECUTE_INSTRUCTION
	| ActionType.SET_MEMORY_OPERATION

/** The CPU state */
export default class CPU implements ActionConsumer<CPUHandledAction> {
	private _instructionRegister: InstructionRegister
	private _programCounter: ProgramCounter
	private _decoder: Decoder
	private _controlUnit: ControlUnit
	private _mux: Multiplexer
	private _alu: ArithmeticLogicUnit
	private _accumulator: Accumulator
	private _statusWord: StatusWord

	// TODO: These handler maps could be static and `this` could be passed to the handlers when
	// they are invoked
	public readonly actionHandlers: ActionHandlerMap<CPUHandledAction>
	/** Maps a {@link Register}-{@link BusID} pair to a function that handles the received {@link SendSignalBusAction} */
	private readonly sendSignalHandlerMap: EnumCombinationMap<() => void, [Register, BusID]>
	/** Maps a {@link Register}-{@link BusID} pair to a function that handles the received {@link ReadSignalBusAction} */
	private readonly readSignalHandlerMap: EnumCombinationMap<() => void, [Register, BusID]>

	constructor(
		dataBus: Bus<16>,
		addressBus: Bus<8>,
		memoryControlBus: Bus<8>,
		opcodeDecoderBus: Bus<8>,
		muxAluBus: Bus<16>,
		muxControlBus: Bus<8>,
		aluControlBus: Bus<8>,
		statusWordBus: Bus<8>,
		aluAccumulatorBus: Bus<16>,
	) {
		this._instructionRegister = new InstructionRegister(dataBus, opcodeDecoderBus, addressBus)
		this._programCounter = new ProgramCounter(addressBus)
		this._decoder = new Decoder(opcodeDecoderBus)
		this._controlUnit = new ControlUnit(
			this._decoder,
			muxControlBus,
			aluControlBus,
			memoryControlBus,
		)
		this._mux = new Multiplexer(addressBus, dataBus, muxAluBus, muxControlBus)
		this._alu = new ArithmeticLogicUnit(
			dataBus,
			muxAluBus,
			aluAccumulatorBus,
			statusWordBus,
			aluControlBus,
		)
		this._accumulator = new Accumulator(aluAccumulatorBus, dataBus)
		this._statusWord = new StatusWord(statusWordBus)
		this.actionHandlers = new ActionHandlerMap({
			[ActionType.SEND_SIGNAL]: this.handleSendSignalAction.bind(this),
			[ActionType.READ_SIGNAL]: this.handleReadSignalAction.bind(this),
			[ActionType.DECODE_INSTRUCTION]: this.handleDecodeInstructionAction.bind(this),
			[ActionType.EXECUTE_INSTRUCTION]: this.handleExecuteInstructionAction.bind(this),
			[ActionType.SET_MEMORY_OPERATION]: this.handleSetMemoryOperationAction.bind(this),
		})
		this.sendSignalHandlerMap = {
			[Register.PROGRAM_COUNTER]: {
				[BusID.ADDRESS]: () => this._programCounter.sendAddressSignal(),
			},
			[Register.INSTRUCTION_REGISTER]: {
				[BusID.OPCODE_DECODER]: () => this._instructionRegister.sendOpcodeSignal(),
				[BusID.ADDRESS]: () => this._instructionRegister.sendOperandSignal(),
			},
			[Register.CONTROL_UNIT]: {
				[BusID.MEMORY_CONTROL]: () => this._controlUnit.sendMemoryOperationSignal(),
				[BusID.MUX_CONTROL]: () => this._controlUnit.sendAddressingModeSignal(),
				[BusID.ALU_CONTROL]: () => this._controlUnit.sendOperationSignal(),
			},
			[Register.MUX]: {
				[BusID.MUX_ALU]: () => this._mux.sendSignal(),
			},
			[Register.ALU]: {
				[BusID.ALU_ACCUMULATOR]: () => this._alu.sendResultSignal(),
				[BusID.STATUS_WORD]: () => this._alu.sendStatusWordSignal(),
			},
			[Register.ACCUMULATOR]: {
				[BusID.DATA]: () => this._accumulator.sendDataSignal(),
			},
			[Register.STATUS_WORD]: {
				[BusID.STATUS_WORD]: () => this._statusWord.sendAluSignal(),
			},
		}
		this.readSignalHandlerMap = {
			[Register.PROGRAM_COUNTER]: {
				[BusID.ADDRESS]: () => this._programCounter.readAddressSignal(),
			},
			[Register.INSTRUCTION_REGISTER]: {
				[BusID.DATA]: () => this._instructionRegister.readDataSignal(),
			},
			[Register.DECODER]: {
				[BusID.OPCODE_DECODER]: () => this._decoder.readOpcodeSignal(),
			},
			[Register.MUX]: {
				[BusID.ADDRESS]: () => this._mux.readSignal(),
				[BusID.MUX_CONTROL]: () => this._mux.readAddressingModeSignal(),
			},
			[Register.ALU]: {
				[BusID.DATA]: () => this._alu.readOperand1Signal(),
				[BusID.MUX_ALU]: () => this._alu.readOperand2Signal(),
				[BusID.STATUS_WORD]: () => this._alu.readStatusWordSignal(),
				[BusID.ALU_CONTROL]: () => this._alu.readOperationSignal(),
			},
			[Register.ACCUMULATOR]: {
				[BusID.ALU_ACCUMULATOR]: () => this._accumulator.readAluSignal(),
			},
			[Register.STATUS_WORD]: {
				[BusID.STATUS_WORD]: () => this._statusWord.readAluSignal(),
			},
		}
	}

	get instructionRegister(): Pick<InstructionRegister, "msb" | "lsb" | "signed" | "unsigned"> {
		return this._instructionRegister
	}

	get programCounter(): Pick<ProgramCounter, "address" | "signed" | "unsigned"> {
		return this._programCounter
	}

	get decoder(): Pick<Decoder, "decodedOpcode" | "decodedImmediateFlag"> {
		return this._decoder
	}

	get controlUnit(): Pick<ControlUnit, "memoryOperation"> {
		return this._controlUnit
	}

	get multiplexer(): Pick<Multiplexer, "addressingMode"> {
		return this._mux
	}

	get alu(): Pick<ArithmeticLogicUnit, "operand1" | "operand2" | "operation"> {
		return this._alu
	}

	get accumulator(): Pick<Accumulator, "msb" | "lsb" | "signed" | "unsigned"> {
		return this._accumulator
	}

	get statusWord(): Pick<StatusWord, "zeroFlag" | "negativeFlag" | "signed" | "unsigned"> {
		return this._statusWord
	}

	/** {@link ActionHandler} for {@link SendSignalBusAction} */
	private async handleSendSignalAction(
		action: SendSignalBusAction,
	): Promise<ActionHandlerResult> {
		const handler = this.sendSignalHandlerMap[action.from]?.[action.bus]
		if (handler === undefined) {
			return ACTION_UNHANDLED
		}
		handler()
		return ACTION_HANDLED
	}

	/** {@link ActionHandler} for {@link ReadSignalBusAction} */
	private async handleReadSignalAction(
		action: ReadSignalBusAction,
	): Promise<ActionHandlerResult> {
		const handler = this.readSignalHandlerMap[action.into]?.[action.bus]
		if (handler === undefined) {
			return ACTION_UNHANDLED
		}
		handler()
		return ACTION_HANDLED
	}

	/** {@link ActionHandler} for {@link DecodeInstructionAction} */
	private async handleDecodeInstructionAction(): Promise<ActionHandlerResult> {
		todo()
	}

	/** {@link ActionHandler} for {@link ExecuteInstructionAction} */
	private async handleExecuteInstructionAction(): Promise<ActionHandlerResult> {
		todo()
	}

	/** {@link ActionHandler} for {@link SetMemoryOperationAction} */
	private async handleSetMemoryOperationAction(
		action: SetMemoryOperationAction,
	): Promise<ActionHandlerResult> {
		this._controlUnit.memoryOperation = action.operation
		return ACTION_HANDLED
	}
}
