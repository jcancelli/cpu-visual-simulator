import { LabelValidationResult, type LabelValidationFail } from "$lib/types/label"
import { CPUVSError } from "./cpuvs"

/** Base class for all errors regarding a label */
export abstract class LabelError extends CPUVSError {
	/** The label that caused the error */
	public readonly label: string

	constructor(label: string, message: string) {
		super(message)
		this.label = label
	}
}

/** Error regarding a {@link LabelValidationResult} */
export class InvalidLabelError extends LabelError {
	/** The reason why the label is invalid */
	public readonly reason: LabelValidationFail

	constructor(label: string, reason: LabelValidationFail) {
		super(label, `Invalid label: "${label}". Reason: ${LabelValidationResult[reason]}`)
		this.reason = reason
	}
}

/** Error regarding a label that was already mapped to an address */
export class DuplicateLabelError extends LabelError {
	constructor(label: string) {
		super(label, `Duplicate label: "${label}"`)
	}
}

/** Error regarding a label that does not exist */
export class LabelNotFoundError extends LabelError {
	constructor(label: string) {
		super(label, `Label "${label}" does not exist`)
	}
}
