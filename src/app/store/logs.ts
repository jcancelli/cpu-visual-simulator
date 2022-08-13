import { writable } from "svelte/store"
import { Log } from "../util/logger"

const _logsStore = writable<Log[]>([])

export const logsStore = {
	subscribe: _logsStore.subscribe,
	push(log: Log) {
		_logsStore.update(logs => [...logs, log])
	}
}

const _loggerStore = writable({
	showLogger: false
})

export const loggerStore = {
	subscribe: _loggerStore.subscribe,
	updateShowLogger(updater: (oldVal: boolean) => boolean) {
		_loggerStore.update(oldVal => ({
			...oldVal,
			showLogger: updater(oldVal.showLogger)
		}))
	}
}
