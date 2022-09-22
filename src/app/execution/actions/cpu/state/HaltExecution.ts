import { cpuStore } from "../../../../store/state"
import CpuAction from "../CpuAction"

export default class HaltExecution extends CpuAction {
	constructor() {
		super()
		this._name = "HaltExecution"
	}

	protected async action(): Promise<any> {
		cpuStore.get().isHalting.set(true)
	}
}