import { get, Writable, writable } from "svelte/store"
import cpuStore from "../store/cpuStore"
import Action from "./actions/Action"
import { instructionToActions } from "./actions/instructionToActionConverter"
import Instruction from "../instruction/Instruction"
import { Operators } from "../instruction/Opcode"
import { LAST_ADDRESS } from "../util/ramUtil"
import { messageFeed } from "../store/componentsStore"
import { FETCH, INCREMENT_PC } from "./actions/actionMacros"

export type Cache = {
	IR: Instruction | null
	"IR:OPC": number | null
	"IR:OPR": number | null
	PC: number | null
	INC: number | null
	"ALU:1": number | null
	"ALU:2": number | null
	"ALU:OPR": Operators
	ACC: number | null
	"SW:Z": boolean
	"SW:N": boolean
	RAM: {
		address: number
		data: Instruction
	}
}

export type CacheableKey = keyof Cache

type CycleFase =
	| "ENQUEUING_FETCH"
	| "EXECUTING_FETCH"
	| "ENQUEUING_INSTRUCTION"
	| "EXECUTING_INSTRUCTION"
	| "ENQUEUEING_PC_INCREMENT"
	| "EXECUTING_PC_INCREMENT"

const CYCLES_PER_SECOND = 20

const privateIsExecutingStore = {
	...writable(false),
	update: () => privateIsExecutingStore.set(isPlaying || isShortStepping || isLongStepping)
}
export const isExecutingStore = { subscribe: privateIsExecutingStore.subscribe } // read-only reference to isExecutingStore

let isPlaying = false
let isShortStepping = false // is executing a single step
let isLongStepping = false // is executing a full instruction
let isLocked = false // prevent concurrency
let cycleFase: CycleFase = "ENQUEUING_FETCH"
let queue: Action[] = [] // contains all actions to be executed

let cache: Cache = {
	IR: null,
	"IR:OPC": null,
	"IR:OPR": null,
	PC: null,
	INC: null,
	"ALU:1": null,
	"ALU:2": null,
	"ALU:OPR": "",
	ACC: null,
	"SW:Z": true,
	"SW:N": false,
	RAM: null
}

setInterval(cycle, 1000 / CYCLES_PER_SECOND)

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
				queue.push(...instructionToActions(cache["IR"]))
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
				}
				if (queueIsEmpty()) {
					cycleFase = "ENQUEUING_FETCH"
				}
				break
		}
	} catch (error) {
		cpuStore.setIsHalting(true)
		get(messageFeed).message("ERROR", error.message)
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
		await action.execute(cache)
		if (isShortStepping && action.doesEndStep()) {
			setIsShortStepping(false)
		}
	}
}

function start() {
	setIsPlaying(true)
	setIsShortStepping(false)
	setIsLongStepping(false)
}

function pause() {
	setIsPlaying(false)
	setIsShortStepping(false)
	setIsLongStepping(false)
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
}

function instruction() {
	setIsPlaying(false)
	setIsShortStepping(false)
	setIsLongStepping(true)
}

function reset() {
	pause()
	cycleFase = "ENQUEUING_FETCH"
	emptyExecutionQueue()
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
