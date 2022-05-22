import { immediateFlag, removeFlags } from "../util/instructionUtil"
import { Opcode, opcode } from "./Opcode"

export default class Instruction {
	readonly opcode: Opcode | undefined
	readonly immediateFlag: boolean
	readonly symbolicOpcode: string
	readonly symbolicOperand: string
	readonly binaryOpcode: string
	readonly binaryOperand: string
	readonly numericOpcode: number // signed
	readonly numericOperand: number // signed if immediate else unsigned

	constructor(
		symOpc: string,
		symOpr: string,
		binOpc: string,
		binOpr: string,
		numOpc: number,
		numOpr: number,
		invalidate = false
	) {
		this.opcode = opcode(removeFlags(numOpc))
		this.immediateFlag = immediateFlag(numOpc)
		this.symbolicOpcode = symOpc
		this.symbolicOperand = symOpr
		this.binaryOpcode = binOpc
		this.binaryOperand = binOpr
		this.numericOpcode = numOpc
		this.numericOperand = numOpr
		if (invalidate) {
			this.opcode = undefined
		}
	}
}
