/** Thrown by a function when an argument does not satisfies some condition(s) */
export class InvalidArgumentError extends Error {
	constructor(message: string) {
		super(message)
		Object.setPrototypeOf(this, InvalidArgumentError)
	}
}
