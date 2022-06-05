export default class CheckedError extends Error {
	readonly isChecked = true

	constructor(message: string) {
		super(message)
	}
}
