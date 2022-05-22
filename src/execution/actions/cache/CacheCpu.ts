import { get } from "svelte/store"
import cpuStore from "../../../store/cpuStore"
import { Cache, CacheableKey } from "../../execution"
import CacheAction from "./CacheAction"

export default class CacheCpu extends CacheAction {
	constructor(key: CacheableKey) {
		super(key)
		if (key === "RAM") {
			throw new Error("CacheCpuValue cannot cache RAM value")
		}
	}

	protected async action(cache: Cache): Promise<any> {
		const cpu = get(cpuStore)
		switch (this.key) {
			case "ACC":
				cache["ACC"] = cpu.accumulator
				break
			case "ALU:1":
				cache["ALU:1"] = cpu.alu1
				break
			case "ALU:2":
				cache["ALU:2"] = cpu.alu2
				break
			case "ALU:OPR":
				cache["ALU:OPR"] = cpu.operation
				break
			case "IR":
				cache["IR"] = cpu.instructionRegister
				cache["IR:OPC"] = cpu.instructionRegister.numericOpcode
				cache["IR:OPR"] = cpu.instructionRegister.numericOperand
				break
			case "PC":
				cache["PC"] = cpu.programCounter
				break
			case "INC":
				cache["INC"] = cpu.increment
				break
			case "SW:Z":
				cache["SW:Z"] = cpu.zeroFlag
				break
			case "SW:N":
				cache["SW:N"] = cpu.negativeFlag
				break
			default:
				throw new Error(`Unexpected cacheable key "${this.key}"`)
		}
	}
}
