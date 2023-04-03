import { derived, Readable, writable, Writable } from "../util/customStores"
import { interpolate } from "../../shared/util/template"
import logger, { LogCategory } from "../util/logger"
import { Language } from "../../shared/util/i18n"
import { parse as parseYaml } from "yaml"
import { language } from "../store/settings"
import text from "../store/text"

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

type FetchedMessage = {
	message: {
		[key in Language]: string
	}
	type: MessageType
	expiresInSec: number
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

	public async fetchMessages(messagesUrl: string): Promise<void> {
		logger.debug("Fetching messages", LogCategory.INIT)
		await fetch(messagesUrl)
			.then(res => res.text())
			.then(text => parseYaml(text))
			.then((data: { messages: FetchedMessage[] }) => {
				logger.debug(`Messages fetched - ${data.messages.length} messages found`, LogCategory.INIT)
				data.messages.forEach((message: FetchedMessage) => {
					this.addMessage({
						message: message.message[language.get()],
						type: message.type,
						expiresInSec: message.expiresInSec
					})
				})
			})
			.catch(error => {
				logger.unexpected_error(error.message, LogCategory.INIT)
				this.error(interpolate(text.get().errors.generic.fetch_error, messagesUrl))
			})
	}
}
