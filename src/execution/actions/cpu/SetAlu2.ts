import { get } from "svelte/store"
import { cpu } from "../../../store/components"
import cpuStore from "../../../store/cpu"
import state from "../../state"
import CpuAction from "./CpuAction"

export default class SetAlu2 extends CpuAction {
	protected value: "IR:OPR" | "RAM"

	constructor(value: "IR:OPR" | "RAM") {
		super()
		this.value = value
	}

	protected async action(): Promise<any> {
		switch (this.value) {
			case "IR:OPR":
				cpuStore.setALU2(state["IR"].numericOperand())
				state["ALU:2"] = state["IR"].numericOperand()
				break
			case "RAM":
				cpuStore.setALU2(state["RAM"].data.value.signed())
				state["ALU:2"] = state["RAM"].data.value.signed()
				break
			default:
				throw new Error(`Unexpected value "${this.value}"`)
		}
		await get(cpu).flash("ALU:2")
	}
}
