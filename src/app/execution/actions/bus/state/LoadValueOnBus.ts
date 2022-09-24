import BusAction from "../BusAction"
import { ExecutionContext } from "../../../ExecutionContext"
import { Bus } from "../../../../model/Wires"

export type DataBusValueSource = "RAM" | "IR:OPC" | "IR:OPR" | "ALU:RES" | "ACC"
export type ControlBusValueSource = "CU"
export type AddressBusValueSource = "PC" | "INC" | "IR:OPR"
export type ValueSource = DataBusValueSource | ControlBusValueSource | AddressBusValueSource

const DEFAULT_BUSSES = {
	RAM: "data_main",
	"IR:OPC": "data_ir_cu",
	"IR:OPR": "addr_main",
	"ALU:RES": "data_alu_acc",
	ACC: "data_main",
	PC: "addr_main",
	INC: "addr_inc_pc"
} as const

export default class LoadValueOnBus extends BusAction {
	protected valueSource: ValueSource
	protected bus: Bus

	constructor(valueSource: ValueSource, bus: "default" | Bus = "default") {
		super()
		this._name = "LoadValueOnBus"
		this.valueSource = valueSource
		this.bus = bus === "default" ? DEFAULT_BUSSES[valueSource] : bus
	}

	protected async action(ctx: ExecutionContext): Promise<any> {
		ctx.wires.model[this.bus].set(this.getValueFromSource(ctx))
	}

	protected getValueFromSource(ctx: ExecutionContext) {
		switch (this.valueSource) {
			case "RAM":
				return ctx.ram.model.read(ctx.wires.model.addr_main.get().unsigned())
			case "IR:OPC":
				return ctx.cpu.model.instructionRegister.get().opcodeValue()
			case "IR:OPR":
				return ctx.cpu.model.instructionRegister.get().operandValue()
			case "ALU:RES":
				return ctx.cpu.model.aluResult.get()
			case "ACC":
				return ctx.cpu.model.accumulator.get()
			case "CU":
				throw new Error("CU value not implemented")
			case "PC":
				return ctx.cpu.model.programCounter.get()
			case "INC":
				return ctx.cpu.model.increment.get()
			default:
				throw new Error(this.valueSource + " value not implemented")
		}
	}

	toString(): string {
		return `${super.toString()} valueSource: ${this.valueSource} bus: ${this.bus}`
	}
}
