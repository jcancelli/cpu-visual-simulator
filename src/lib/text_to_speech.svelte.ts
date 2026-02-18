import { getLocale, type Locale } from "./paraglide/runtime"
import { getString, setString } from "./util/local_storage"

/** True if text to speech is not available on this browser */
export const TEXT_TO_SPEECH_UNAVAILABLE = window.speechSynthesis === undefined

/** Wrapper for {@link window.speechSynthesis} */
export default class TextToSpeech {
	/** The utterance that is currently being read. */
	private utterance: SpeechSynthesisUtterance | null
	/** Private mutable state containing the promise that resolves when TTS has finished reading. */
	private _speechPromise: Promise<void> | null
	/** Private mutable state containing all the currently available voices for the current locale. */
	private _voices: SpeechSynthesisVoice[]
	/** Private mutable state containing the currently selected voice. */
	private _voice: SpeechSynthesisVoice | null

	constructor() {
		this.utterance = null
		this._speechPromise = $state(null)
		this._voices = $state([])
		this._voice = $state(null)

		if (!TEXT_TO_SPEECH_UNAVAILABLE) {
			const locale = getLocale()
			this._voices = getLocalizedVoices(locale)
			window.speechSynthesis.onvoiceschanged = () => {
				this._voices = getLocalizedVoices(locale)
				this.setVoiceToDefault(locale)
			}
			this.setVoiceToDefault(locale)
			// Update the current utterance voice when _voice changes
			$effect(() => {
				if (this._voice !== null && this.utterance !== null) {
					this.utterance.voice = this._voice
				}
			})
		}
	}
	/** Read the provided text at the specified rate after the previous sentence (if any) has ended.
	 * If TTS is not supported by the browser, nothing happens.
	 * @returns A promise that is resolved when the utterance has ended. */
	async speak(text: string, rate: number = 1): Promise<void> {
		if (TEXT_TO_SPEECH_UNAVAILABLE) {
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

	/** Stop speaking.
	 * If TTS is not supported by the browser, nothing happens. */
	stopSpeaking(): void {
		if (TEXT_TO_SPEECH_UNAVAILABLE) {
			return
		}
		window.speechSynthesis.cancel()
		this.utterance = null
		this._speechPromise = null
	}

	/** Readonly state containing the promise that resolves when TTS has finished reading. */
	get speechPromise(): Promise<void> | null {
		return this._speechPromise
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
		if (TEXT_TO_SPEECH_UNAVAILABLE) {
			return
		}
		if (voice === this._voice) {
			return
		}
		this._voice = voice
		storeUserVoicePreference(voice)
	}

	/** Set the current voice for the specified (or current) locale to the default one.
	 * The lookup order is: user preference -> voice marked as "default" -> the first available voice -> null */
	private setVoiceToDefault(locale: Locale = getLocale()): void {
		const userPreference = retrieveUserVoicePreference(this._voices, locale)
		if (userPreference !== null) {
			this._voice = userPreference
			return
		}
		this._voice = this._voices.find(voice => voice.default) ?? this._voices[0] ?? null
		// WARN: Haven't tested it yet, but it could be possible that synth.getVoices() starts empty
		// or without the user prefered voice and only later gets updated and fires synth.onvoiceschanged.
		// If this happens, this storeUserVoicePreference call would always overwrite the user preference with
		// the fallback value
		storeUserVoicePreference(this._voice, locale)
	}
}

/** Store the specified {@link SpeechSynthesisVoice} as the user preference for the specified (or current) locale. */
function storeUserVoicePreference(voice: SpeechSynthesisVoice, locale: Locale = getLocale()): void {
	setString(`tts_voice_preference_${locale}`, voice.name)
}

/** @returns The {@link SpeechSynthesisVoice} prefered by the user for the specified (or current) locale or null. */
function retrieveUserVoicePreference(
	voices: SpeechSynthesisVoice[],
	locale: Locale = getLocale(),
): SpeechSynthesisVoice | null {
	const voiceName = getString(`tts_voice_preference_${locale}`)
	if (voiceName === null) {
		return null
	}
	return voices.find(voice => voice.name === voiceName) ?? null
}

/** @returns All the {@link SpeechSynthesisVoice} supported by the browser that match the provided locale.
 * If TTS is not supported, an empty array is returned. */
function getLocalizedVoices(locale: Locale): SpeechSynthesisVoice[] {
	if (TEXT_TO_SPEECH_UNAVAILABLE) {
		return []
	}
	return window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(locale))
}
