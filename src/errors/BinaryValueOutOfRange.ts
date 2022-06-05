import CheckedError from "./CheckedError"

export default class BinaryValueOutOfRange extends CheckedError {
	constructor(value: number | string, bits: number) {
		super(`Value ${value} out of ${bits}-bit valid range`)
	}
}
