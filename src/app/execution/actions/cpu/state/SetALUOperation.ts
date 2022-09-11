import { cpu as cpuComponent } from "../../../../store/components"
import cpuStore from "../../../../store/cpu"
import CpuAction from "../CpuAction"

export default class SetALUOperation extends CpuAction {
	constructor() {
		super()
		this._name = "SetALUOperation"
	}

	protected async action(): Promise<any> {
		const cpu = cpuStore.get()
		const operation = cpu.instructionRegister.get().opcode.operator
		cpu.aluOperation.set(operation)
		await cpuComponent.get().flash("ALU:OPR")
	}
}
