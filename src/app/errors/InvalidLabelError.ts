import CheckedError from "./CheckedError"

export default class InvalidLabelError extends CheckedError {
	readonly badLabel: string

	constructor(message: string, badLabel: string) {
		super(message)
		this.badLabel = badLabel
	}
}
