import { ActionType } from "./execution/action"
import type { ActionHandlerMapping, ActionPerformer } from "./execution/task_system"
import { type Locale } from "./paraglide/runtime"
import { todo } from "./util/development"

/** Wrapper for {@link window.speechSynthesis} */
export default class TextToSpeech implements ActionPerformer {
	public readonly isAvailable: Promise<boolean>
	/** Wether text-to-speech is enabled or not */
	private _isEnabled: boolean
	/** The utterance that is currently being read. */
	private utterance: SpeechSynthesisUtterance | null
	/** Private mutable state containing the promise that resolves when TTS has finished reading. */
	private _speechPromise: Promise<void> | null
	/** Private mutable state containing all the currently available voices for the current locale. */
	private _voices: SpeechSynthesisVoice[]
	/** Private mutable state containing the currently selected voice. */
	private _voice: SpeechSynthesisVoice | null

	constructor(locale: Locale, initVoiceURI?: string) {
		this.isAvailable = new Promise<boolean>(resolve => {
			if (window.speechSynthesis === undefined) {
				resolve(false)
				return
			}
			this._voices = getLocalizedVoices(locale)
			if (this._voices.length === 0) {
				// If the voice list is still empty after 10 seconds, give up
				let giveUp = false
				const timeoutID = setTimeout(() => {
					giveUp = true
					resolve(false)
				}, 10_000)

				window.speechSynthesis.onvoiceschanged = () => {
					// Do not resolve promise if the timeout already resolved it
					if (giveUp) {
						return
					}
					this._voices = getLocalizedVoices(locale)
					if (this._voices.length > 0) {
						clearTimeout(timeoutID)
					}
					window.speechSynthesis.onvoiceschanged = () => {
						this._voices = getLocalizedVoices(locale)
					}
					resolve(true)
				}
				return
			}
			resolve(true)
		}).then(isAvailable => {
			if (isAvailable) {
				this._voice =
					this._voices.find(voice => voice.voiceURI === initVoiceURI) // Try init voice
					?? this._voices.find(voice => voice.default) // Fallback to the one marked as default by the browser
					?? this._voices[0] // Fallback to the first one
			}
			return isAvailable
		})
		this._isEnabled = $state(false)
		this.utterance = null
		this._speechPromise = $state(null)
		this._voices = $state([])
		this._voice = $state(null)
	}

	/** Read the provided text at the specified rate after the previous sentence (if any) has ended.
	 * If TTS is not supported by the browser, nothing happens.
	 * @returns A promise that is resolved when the utterance has ended. */
	async read(text: string, rate: number = 1): Promise<void> {
		if (!(await this.isAvailable) || !this._isEnabled) {
			return
		}
		await this._speechPromise
		this._speechPromise = new Promise(resolve => {
			this.utterance = new SpeechSynthesisUtterance(text)
			this.utterance.rate = rate
			this.utterance.voice = this._voice
			this.utterance.onend = this.utterance.onerror = () => resolve()
			window.speechSynthesis.speak(this.utterance)
		})
		return this._speechPromise
	}

	/** Stop reading */
	async stopReading(): Promise<void> {
		if (!(await this.isAvailable)) {
			return
		}
		window.speechSynthesis.cancel()
		this.utterance = null
		this._speechPromise = null
	}

	/** Await fot TTS to stop reading */
	async awaitReadingEnd(): Promise<void> {
		await this._speechPromise
	}

	/** Wether text-to-speech is enabled or not */
	get isEnabled(): boolean {
		return this._isEnabled
	}

	/** Wether text-to-speech is enabled or not */
	set isEnabled(enabled: boolean) {
		if (this.isEnabled === enabled) {
			return
		}
		if (!enabled) {
			this.stopReading()
		}
		this.isEnabled = enabled
	}

	/** Readonly state containing all the currently available voices for the current locale. */
	get voices(): ReadonlyArray<SpeechSynthesisVoice> {
		return this._voices
	}

	/** Mutable state containing the currently selected voice. */
	get voice(): SpeechSynthesisVoice | null {
		return this._voice
	}

	/** Mutable state containing the currently selected voice. */
	set voice(voice: SpeechSynthesisVoice) {
		if (voice === this._voice) {
			return
		}
		this._voice = voice
	}

	getActionHandlersMappings(): ActionHandlerMapping[] {
		return [
			{
				action: ActionType.TEXT_TO_SPEECH_READ,
				handler: async () => {
					todo("Define text-to-speech localized strings") // TODO: Define text to speech localized strings
				},
			},
			{
				action: ActionType.AWAIT_TEXT_TO_SPEECH_END,
				handler: async () => {
					await this._speechPromise
					return { actionWasHandled: true }
				},
			},
		]
	}
}

/** @returns All the {@link SpeechSynthesisVoice} supported by the browser that match the provided locale.
 * If TTS is not supported, an empty array is returned. */
function getLocalizedVoices(locale: Locale): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(locale))
}
