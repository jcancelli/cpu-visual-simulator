import type { WordAddressRegister } from "$lib/register/word_address"
import { ActionType } from "$lib/types/action"
import {
	MAX_WORD_ADDRESS,
	MIN_ADDRESS,
	WORD_ALIGNMENT,
	type WordAlignedAddress,
} from "$lib/types/address"
import { assert } from "$lib/util/development"
import type { ActionHandler, SubmitTasksFunction } from "../action_handler"
import type {
	IncrementAddressAction,
	IncrementIncrementerAction,
	ResetProgramCounterAction,
} from "../action/cpu"
import { INCREMENT_PROGRAM_COUNTER_ACTIONS, MAX_ADDRESS_REACHED_ACTIONS } from "../steps_actions"

/** {@link ActionHandler} for {@link IncrementAddressAction} */
export class IncrementAddressActionHandler implements ActionHandler<IncrementAddressAction> {
	private programCounter: WordAddressRegister

	constructor(programCounter: WordAddressRegister) {
		this.programCounter = programCounter
	}

	get actionType(): ActionType {
		return ActionType.INCREMENT_ADDRESS
	}

	handle(_: IncrementAddressAction, submitTasks: SubmitTasksFunction): void {
		if (this.programCounter.address === MAX_WORD_ADDRESS) {
			submitTasks(...MAX_ADDRESS_REACHED_ACTIONS)
		} else {
			submitTasks(...INCREMENT_PROGRAM_COUNTER_ACTIONS)
		}
	}
}

/** {@link ActionHandler} for {@link IncrementIncrementerAction} */
export class IncrementIncrementerActionHandler implements ActionHandler<IncrementIncrementerAction> {
	private programCounterIncrementer: WordAddressRegister

	constructor(programCounterIncrementer: WordAddressRegister) {
		this.programCounterIncrementer = programCounterIncrementer
	}

	get actionType(): ActionType {
		return ActionType.INCREMENT_INCREMENTER
	}

	handle(): void {
		assert(this.programCounterIncrementer.address < MAX_WORD_ADDRESS)
		this.programCounterIncrementer.unsigned += WORD_ALIGNMENT
	}
}

/** {@link ActionHandler} for {@link ResetProgramCounterAction} */
export class ResetProgramCounterActionHandler implements ActionHandler<ResetProgramCounterAction> {
	private programCounter: WordAddressRegister

	constructor(programCounter: WordAddressRegister) {
		this.programCounter = programCounter
	}

	get actionType(): ActionType {
		return ActionType.RESET_PROGRAM_COUNTER
	}

	handle(): void {
		this.programCounter.address = MIN_ADDRESS as WordAlignedAddress
	}
}
