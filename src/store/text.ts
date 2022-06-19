import { get, writable } from "svelte/store"
import { language, SupportedLang } from "./settings"

export type Step = keyof Text["steps"]
export type Text = typeof text_placeholder
const text_placeholder = {
	displayName: "",
	steps: {
		pc_to_ram: "",
		memory_fetch: "",
		instruction_to_ir: "",
		opcode_to_decoder: "",
		cu_sets_mux: "",
		cu_sets_operation: "",
		acc_to_alu1: "",
		pc_increment: ""
	},
	menu: {
		buttons: {
			settings: {
				title: ""
			},
			save: {
				title: ""
			},
			open: {
				title: ""
			},
			language: {
				title: ""
			},
			help: {
				title: ""
			}
		}
	},
	controls: {
		labels: {
			execution: "",
			step: "",
			instruction: "",
			speed: ""
		},
		buttons: {
			reset: {
				title: ""
			},
			play: {
				title: ""
			},
			pause: {
				title: ""
			},
			end: {
				title: ""
			},
			play_step: {
				title: ""
			},
			skip_step: {
				title: ""
			},
			play_instruction: {
				title: ""
			},
			skip_instruction: {
				title: ""
			}
		},
		sliders: {
			speed: {
				title: ""
			}
		},
		checkboxes: {
			binary: {
				text: ""
			},
			animations: {
				text: ""
			}
		}
	}
}

export const texts = writable<Text>(text_placeholder)

fetchText(get(language))

export function fetchText(lang: SupportedLang) {
	fetch(`resources/texts/${lang}.json`)
		.then(res => res.json())
		.then(data => texts.set(data as Text))
}

export default texts
