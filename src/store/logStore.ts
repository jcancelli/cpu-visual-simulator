import { writable } from "svelte/store"

const logsStore = writable<string[]>([])

function push(log: string) {
	logsStore.update(logs => [...logs, log])
}

export const logs = { subscribe: logsStore.subscribe, push }
