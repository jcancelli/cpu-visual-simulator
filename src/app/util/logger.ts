import { derived, Readable, writable, Writable } from "./customStores"

const FIRST_TIMESTAMP = Date.now()

export enum LogLevel {
	DEBUG = "DEBUG",
	WARNING = "WARNING",
	HANDLED_ERROR = "HANDLED_ERROR",
	UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
}

export enum LogCategory {
	USER_INPUT = "USER_INPUT",
	EXECUTION = "EXECUTION",
	INIT = "INIT",
	UNCAUGHT = "UNCAUGHT"
}

export type Log = {
	message: string
	timestamp: number
	level: LogLevel
	categories: LogCategory[]
}

export class Logger {
	private readonly _logs: Writable<Log[]> // private writable store
	public readonly logs: Readable<Log[]> // public read-only store

	private static readonly instance = new Logger()

	private constructor() {
		this._logs = writable([])
		this.logs = derived(this._logs, value => value)
	}

	public static getInstance(): Logger {
		return Logger.instance
	}

	private log(message: string, level: LogLevel, ...categories: LogCategory[]): void {
		this._logs.update(logs => [
			...logs,
			{
				message,
				timestamp: elapsed(),
				level,
				categories: [...categories]
			}
		])
	}

	public debug(message: string, ...categories: LogCategory[]): void {
		this.log(message, LogLevel.DEBUG, ...categories)
	}

	public warning(message: string, ...categories: LogCategory[]): void {
		this.log(message, LogLevel.WARNING, ...categories)
	}

	public handled_error(message: string, ...categories: LogCategory[]): void {
		this.log(message, LogLevel.HANDLED_ERROR, ...categories)
	}
	public unexpected_error(message: string, ...categories: LogCategory[]): void {
		this.log(message, LogLevel.UNEXPECTED_ERROR, ...categories)
	}
}

const logger = Logger.getInstance()

// milliseconds from when FIRST_TIMESTAMP was set
function elapsed(): number {
	return Date.now() - FIRST_TIMESTAMP
}

export default logger
