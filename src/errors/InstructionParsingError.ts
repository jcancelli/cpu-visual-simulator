import CheckedError from "./CheckedError"

export default class InstructionParsingError extends CheckedError {
	readonly inputString: string

	constructor(message: string, inputString: string) {
		super(message)
		this.inputString = inputString
	}
}
