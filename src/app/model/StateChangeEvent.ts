import BinaryValue from "./BinaryValue"
import Cpu, { CpuComponent } from "./Cpu"
import Instruction from "./Instruction"
import { Operators } from "./InstructionSet"
import Ram from "./Ram"
import SymbolTable from "./SymbolTable"
import Wires, { Bus } from "./Wires"

export abstract class StateChangeEvent<T1, T2> {
	stateComponent: T1
	oldValue: T2
	newValue: T2
	endsStep: boolean
	endsInstruction: boolean

	constructor(stateComponent: T1, oldValue: T2, newValue: T2, endsStep = false, endsInstruction = false) {
		this.stateComponent = stateComponent
		this.oldValue = oldValue
		this.newValue = newValue
		this.endsStep = endsStep
		this.endsInstruction = endsInstruction
	}

	public abstract restore(): void
}

export type CpuStateChangeEventValue = {
	component: CpuComponent
	value: Instruction | BinaryValue | Operators | boolean
}

export class CpuStateChangeEvent extends StateChangeEvent<Cpu, CpuStateChangeEventValue> {
	constructor(
		stateComponent: Cpu,
		oldValue: CpuStateChangeEventValue,
		newValue: CpuStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
	}

	public restore(): void {
		this.stateComponent.set(this.oldValue.component, this.oldValue.value)
	}
}

export type RamStateChangeEventValue = {
	address: number
	value: Instruction
}

export class RamStateChangeEvent extends StateChangeEvent<Ram, RamStateChangeEventValue> {
	constructor(
		stateComponent: Ram,
		oldValue: RamStateChangeEventValue,
		newValue: RamStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
	}

	public restore(): void {
		this.stateComponent.write(this.oldValue.address, this.oldValue.value)
	}
}

export type SymbolTableStateChangeEventValue = {
	address: number
	value: string
}

export class SymbolTableStateChangeEvent extends StateChangeEvent<
	SymbolTable,
	SymbolTableStateChangeEventValue
> {
	constructor(
		stateComponent: SymbolTable,
		oldValue: SymbolTableStateChangeEventValue,
		newValue: SymbolTableStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
	}

	public restore(): void {
		this.stateComponent.setLabel(this.oldValue.address, this.oldValue.value)
	}
}

export type WiresStateChangeEventValue = {
	bus: Bus
	value: BinaryValue
}

export class WiresStateChangeEvent extends StateChangeEvent<Wires, WiresStateChangeEventValue> {
	constructor(
		stateComponent: Wires,
		oldValue: WiresStateChangeEventValue,
		newValue: WiresStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
	}

	public restore(): void {
		this.stateComponent.set(this.oldValue.bus, this.oldValue.value)
	}
}
