import { get } from "svelte/store"
import cpuStore from "../../../store/cpu"
import state, { Key as StateKey } from "../../state"
import StateAction from "./StateAction"

export default class CacheCpu extends StateAction {
	constructor(key: StateKey) {
		super(key)
		if (key === "RAM") {
			throw new Error("CacheCpuValue cannot cache RAM value")
		}
	}

	protected async action(): Promise<any> {
		const cpu = get(cpuStore)
		switch (this.key) {
			case "ACC":
				state["ACC"] = cpu.accumulator.signed()
				break
			case "ALU:1":
				state["ALU:1"] = cpu.alu1.signed()
				break
			case "ALU:2":
				state["ALU:2"] = cpu.alu2.signed()
				break
			case "ALU:OPR":
				state["ALU:OPR"] = cpu.operation
				break
			case "IR":
				state["IR"] = cpu.instructionRegister
				state["IR:OPC"] = cpu.instructionRegister.numericOpcode()
				state["IR:OPR"] = cpu.instructionRegister.numericOperand()
				break
			case "PC":
				state["PC"] = cpu.programCounter.unsigned()
				break
			case "INC":
				state["INC"] = cpu.increment.unsigned()
				break
			case "SW:Z":
				state["SW:Z"] = cpu.zeroFlag
				break
			case "SW:N":
				state["SW:N"] = cpu.negativeFlag
				break
			default:
				throw new Error(`Unexpected cacheable key "${this.key}"`)
		}
	}
}
