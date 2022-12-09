import { derived, Readable, writable, Writable } from "../util/customStores"

export enum MessageType {
	ERROR = "ERROR",
	WARNING = "WARNING",
	SUCCESS = "SUCCESS",
	INFO = "INFO",
	BUG = "BUG"
}

export type Message = {
	id: number
} & MessageInfo

export type MessageInfo = {
	type: MessageType
	message: string
	expiresInSec: number // -1 to disable timer
}

export default class MessageFeed {
	public readonly messages: Readable<Message[]>
	protected _messages: Writable<Message[]>
	public static readonly NO_EXPIRE = -1

	constructor() {
		this._messages = writable([])
		this.messages = derived(this._messages, $instructions => $instructions)
	}

	public error(message: string, expiresInSec = 5): number {
		return this.addMessage({
			type: MessageType.ERROR,
			message,
			expiresInSec
		})
	}

	public warning(message: string, expiresInSec = 5): number {
		return this.addMessage({
			type: MessageType.WARNING,
			message,
			expiresInSec
		})
	}

	public success(message: string, expiresInSec = 5): number {
		return this.addMessage({
			type: MessageType.SUCCESS,
			message,
			expiresInSec
		})
	}

	public info(message: string, expiresInSec = 5): number {
		return this.addMessage({
			type: MessageType.INFO,
			message,
			expiresInSec
		})
	}

	public bug(message: string, expiresInSec = MessageFeed.NO_EXPIRE): number {
		return this.addMessage({
			type: MessageType.BUG,
			message,
			expiresInSec
		})
	}

	public addMessage(message: MessageInfo): number {
		const messageId = Math.random()
		this._messages.set([
			...this._messages.get(),
			{
				id: messageId,
				...message
			}
		])
		return messageId
	}

	public deleteMessage(messageId: number): void {
		this._messages.update(messages => {
			return messages.filter(m => m.id !== messageId)
		})
	}
}
