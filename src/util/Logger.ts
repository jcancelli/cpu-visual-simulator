import { logsStore } from "../store/logStore"

const FIRST_TIMESTAMP = Date.now()

export const LogGroups = ["EXECUTION", "USER_INPUT", "DEBUG"] as const
export const LogTypes = ["UNCHECKED_ERROR", "CHECKED_ERROR", "INFO"] as const
export type LogGroup = typeof LogGroups[number]
export type LogType = typeof LogTypes[number]
export type Log = {
	logType: LogType
	logGroup: LogGroup
	timestamp: number
	message: string
}

function error(err: Error, logGroup: LogGroup, checked: boolean = false) {
	logsStore.push({
		logType: checked ? "CHECKED_ERROR" : "UNCHECKED_ERROR",
		logGroup,
		timestamp: elapsed(),
		message: checked ? err.message : err.stack
	})
}

function info(message: string, logGroup: LogGroup) {
	logsStore.push({
		logType: "INFO",
		logGroup,
		timestamp: elapsed(),
		message
	})
}

// milliseconds from when FIRST_TIMESTAMP was set
function elapsed(): number {
	return Date.now() - FIRST_TIMESTAMP
}

export default {
	error,
	info
}
