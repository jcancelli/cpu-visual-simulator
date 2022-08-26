import { get } from "svelte/store"
import { cpu } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetALUOperation extends CpuAction {
	constructor() {
		super()
		this._name = "SetALUOperation"
	}

	protected async action(): Promise<any> {
		const operation = get(cpuStore.instructionRegister).opcode.operator
		cpuStore.aluOperation.set(operation)
		await get(cpu).flash("ALU:OPR")
	}
}
