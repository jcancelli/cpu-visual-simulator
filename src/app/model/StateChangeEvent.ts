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

export type CpuStateChangeEventValue = Instruction | BinaryValue | Operators | boolean

export class CpuStateChangeEvent extends StateChangeEvent<Cpu, CpuStateChangeEventValue> {
	protected component: CpuComponent

	constructor(
		stateComponent: Cpu,
		component: CpuComponent,
		oldValue: CpuStateChangeEventValue,
		newValue: CpuStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
		this.component = component
	}

	public restore(): void {
		this.stateComponent.set(this.component, this.oldValue)
	}
}

export type RamStateChangeEventValue = Instruction

export class RamStateChangeEvent extends StateChangeEvent<Ram, RamStateChangeEventValue> {
	protected address: number

	constructor(
		stateComponent: Ram,
		address: number,
		oldValue: RamStateChangeEventValue,
		newValue: RamStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
		this.address = address
	}

	public restore(): void {
		this.stateComponent.write(this.address, this.oldValue)
	}
}

export type SymbolTableStateChangeEventValue = string

export class SymbolTableStateChangeEvent extends StateChangeEvent<
	SymbolTable,
	SymbolTableStateChangeEventValue
> {
	protected address: number

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
		this.stateComponent.setLabel(this.address, this.oldValue)
	}
}

export type WiresStateChangeEventValue = BinaryValue

export class WiresStateChangeEvent extends StateChangeEvent<Wires, WiresStateChangeEventValue> {
	protected bus: Bus

	constructor(
		stateComponent: Wires,
		bus: Bus,
		oldValue: WiresStateChangeEventValue,
		newValue: WiresStateChangeEventValue,
		endsStep = false,
		endsInstruction = false
	) {
		super(stateComponent, oldValue, newValue, endsStep, endsInstruction)
	}

	public restore(): void {
		this.stateComponent.set(this.bus, this.oldValue)
	}
}
