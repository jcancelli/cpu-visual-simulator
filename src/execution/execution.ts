import { get, writable } from "svelte/store"
import cpuStore from "../store/cpuStore"
import Action from "./actions/Action"
import { instructionToActions } from "./actions/instructionToActionConverter"
import { LAST_ADDRESS } from "../util/ramUtil"
import { messageFeed } from "../store/components"
import { FETCH, INCREMENT_PC } from "./actions/presets"
import Logger from "../util/Logger"
import state from "./state"

type CycleFase =
	| "ENQUEUING_FETCH"
	| "EXECUTING_FETCH"
	| "ENQUEUING_INSTRUCTION"
	| "EXECUTING_INSTRUCTION"
	| "ENQUEUEING_PC_INCREMENT"
	| "EXECUTING_PC_INCREMENT"

let isPlaying = false
let isShortStepping = false // is executing a single step
let isLongStepping = false // is executing a full instruction
let isLocked = false // prevent concurrency
let cycleFase: CycleFase = "ENQUEUING_FETCH"
let queue: Action[] = [] // contains all actions to be executed

const privateIsExecutingStore = {
	...writable(false),
	update: () => privateIsExecutingStore.set(isPlaying || isShortStepping || isLongStepping)
}
export const isExecuting = { subscribe: privateIsExecutingStore.subscribe } // read-only reference to isExecutingStore

setInterval(cycle, 50)

async function cycle() {
	if (isLocked || !shouldExecute()) {
		return
	}
	isLocked = true
	try {
		switch (cycleFase) {
			case "ENQUEUING_FETCH":
				queue.push(...FETCH)
				cpuStore.clear()
				cycleFase = "EXECUTING_FETCH"
				break
			case "EXECUTING_FETCH":
				await execute()
				if (queueIsEmpty()) {
					cycleFase = "ENQUEUING_INSTRUCTION"
				}
				break
			case "ENQUEUING_INSTRUCTION":
				queue.push(...instructionToActions(state["IR"]))
				cycleFase = "EXECUTING_INSTRUCTION"
				break
			case "EXECUTING_INSTRUCTION":
				await execute()
				if (queueIsEmpty()) {
					if (
						get(cpuStore).programCounter.unsigned() === LAST_ADDRESS &&
						!get(cpuStore).isJumping
					) {
						cpuStore.setIsHalting(true)
					}
					if (get(cpuStore).isJumping) {
						cycleFase = "ENQUEUING_FETCH"
						if (isLongStepping) {
							setIsLongStepping(false)
						}
					} else {
						cycleFase = "ENQUEUEING_PC_INCREMENT"
					}
				}
				break
			case "ENQUEUEING_PC_INCREMENT":
				queue.push(...INCREMENT_PC)
				cycleFase = "EXECUTING_PC_INCREMENT"
				break
			case "EXECUTING_PC_INCREMENT":
				await execute()
				if (isLongStepping) {
					setIsLongStepping(false)
					cpuStore.setIsHalting(true)
				}
				if (queueIsEmpty()) {
					cycleFase = "ENQUEUING_FETCH"
				}
				break
		}
	} catch (error) {
		cpuStore.setIsHalting(true)
		get(messageFeed).message("ERROR", error.message)
		Logger.error(error, "EXECUTION", error.isChecked)
	} finally {
		if (get(cpuStore).isHalting) {
			reset()
		}
		isLocked = false
	}
}

async function execute() {
	while (!queueIsEmpty() && shouldExecute()) {
		const action = queue.shift()!
		await action.execute()
		if (isShortStepping && action.doesEndStep()) {
			setIsShortStepping(false)
		}
	}
}

function start() {
	setIsPlaying(true)
	setIsShortStepping(false)
	setIsLongStepping(false)
	Logger.info("Execution - START", "EXECUTION")
}

function pause() {
	setIsPlaying(false)
	setIsShortStepping(false)
	setIsLongStepping(false)
	Logger.info("Execution - PAUSE", "EXECUTION")
}

function toggle() {
	if (!get(privateIsExecutingStore)) {
		start()
	} else {
		pause()
	}
}

function step() {
	setIsPlaying(false)
	setIsShortStepping(true)
	setIsLongStepping(false)
	Logger.info("Execution - STEP", "EXECUTION")
}

function instruction() {
	setIsPlaying(false)
	setIsShortStepping(false)
	setIsLongStepping(true)
	Logger.info("Execution - INSTRUCTION", "EXECUTION")
}

function reset() {
	pause()
	cycleFase = "ENQUEUING_FETCH"
	emptyExecutionQueue()
	Logger.info("Execution - RESET", "EXECUTION")
}

function shouldExecute() {
	return isPlaying || isShortStepping || isLongStepping
}

function emptyExecutionQueue() {
	queue = []
}

function queueIsEmpty() {
	return queue.length === 0
}

function setIsPlaying(value: boolean) {
	isPlaying = value
	privateIsExecutingStore.update()
}

function setIsShortStepping(value: boolean) {
	isShortStepping = value
	privateIsExecutingStore.update()
}

function setIsLongStepping(value: boolean) {
	isLongStepping = value
	privateIsExecutingStore.update()
}

export default {
	start,
	pause,
	toggle,
	step,
	instruction,
	reset
}
