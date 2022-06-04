import { logs } from "../store/logStore"

const FIRST_TIMESTAMP = Date.now()

export const LogGroups = ["EXECUTION", "USER_INPUT", "DEBUG"] as const
export type LogGroup = typeof LogGroups[number]

function error(err: Error, logGroup: LogGroup) {
	const msg = `ERROR | ${logGroup} | ${elapsed()} | ${err.stack}`
	logs.push(msg)
	console.error(err)
}

function info(message: string, logGroup: LogGroup) {
	const msg = `INFO | ${logGroup} | ${elapsed()} | ${message}`
	logs.push(msg)
	console.log(message)
}

// milliseconds from when FIRST_TIMESTAMP was set
function elapsed(): number {
	return Date.now() - FIRST_TIMESTAMP
}

export default {
	error,
	info
}
