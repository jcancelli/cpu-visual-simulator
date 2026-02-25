import { type Locale } from "./paraglide/runtime"
import { unreachable } from "./util/development"

/** The minimum value for the text to speech pitch */
export const MIN_TTS_PITCH = 0
/** The maximum value for the text to speech pitch */
export const MAX_TTS_PITCH = 2
/** The default value for the text to speech pitch */
export const DEFAULT_TTS_PITCH = 1
/** The minimum value for the text to speech rate */
export const MIN_TTS_RATE = 0.1
/** The maximum value for the text to speech rate */
export const MAX_TTS_RATE = 10
/** The default value for the text to speech rate */
export const DEFAULT_TTS_RATE = 1
/** The minimum value for the text to speech volume */
export const MIN_TTS_VOLUME = 0
/** The maximum value for the text to speech volume */
export const MAX_TTS_VOLUME = 1
/** The default value for the text to speech volume */
export const DEFAULT_TTS_VOLUME = 1
/** Time in milliseconds after which, if not already resolved, the {@link TextToSpeech.isAvailable} promise is resolved to false */
export const TTS_UNAVAILABLE_TIMEOUT_MS = 10_000

/** Wrapper around {@link window.speechSynthesis} */
export default class TextToSpeech {
	/** Promise that resolves wether text to speech is available on this browser or not.
	 * Resolves to false if after {@link TTS_UNAVAILABLE_TIMEOUT_MS} milliseconds it hasn't already resolved */
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
	/** The pitch at which text to speech will read its sentences */
	private _pitch: number
	/** The rate at which text to speech will read its sentences */
	private _rate: number
	/** The volume at which text to speech will read its sentences */
	private _volume: number

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
		this._pitch = $state(DEFAULT_TTS_PITCH)
		this._rate = $state(DEFAULT_TTS_RATE)
		this._volume = $state(DEFAULT_TTS_VOLUME)
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
		if (this.utterance !== null) {
			this.utterance.voice = voice
		}
	}

	/** The pitch at which text to speech will read its sentences */
	get pitch(): number {
		return this._pitch
	}

	/** The pitch at which text to speech will read its sentences */
	set pitch(pitch: number) {
		if (pitch < MIN_TTS_PITCH || pitch > MAX_TTS_PITCH) {
			unreachable()
		}
		this._pitch = pitch
		if (this.utterance !== null) {
			this.utterance.pitch = pitch
		}
	}

	/** The rate at which text to speech will read its sentences */
	get rate(): number {
		return this._rate
	}

	/** The rate at which text to speech will read its sentences */
	set rate(rate: number) {
		if (rate < MIN_TTS_RATE || rate > MAX_TTS_RATE) {
			unreachable()
		}
		this._rate = rate
		if (this.utterance !== null) {
			this.utterance.rate = rate
		}
	}

	/** The volume at which text to speech will read its sentences */
	get volume(): number {
		return this._volume
	}

	/** The volume at which text to speech will read its sentences */
	set volume(volume: number) {
		if (volume < MIN_TTS_VOLUME || volume > MAX_TTS_VOLUME) {
			unreachable()
		}
		this._volume = volume
		if (this.utterance !== null) {
			this.utterance.volume = volume
		}
	}

	/** Read the provided text after the previous sentence (if any) has ended.
	 * If TTS is not supported by the browser, nothing happens.
	 * @returns A promise that is resolved when the utterance has ended. */
	async read(text: string): Promise<void> {
		if (!(await this.isAvailable) || !this._isEnabled) {
			return
		}
		await this._speechPromise
		this._speechPromise = new Promise(resolve => {
			this.utterance = new SpeechSynthesisUtterance(text)
			this.utterance.rate = this._rate
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
}

/** @returns All the {@link SpeechSynthesisVoice} supported by the browser that match the provided locale.
 * If TTS is not supported, an empty array is returned. */
function getLocalizedVoices(locale: Locale): SpeechSynthesisVoice[] {
	return window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(locale))
}
