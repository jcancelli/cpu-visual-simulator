import CheckedError from "./CheckedError"

export default class ProgramParsingError extends CheckedError {
	constructor(message: string) {
		super(message)
	}
}
