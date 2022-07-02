import { get, writable } from "svelte/store"
import { language, SupportedLang } from "./settings"

export type Step = keyof Lang["steps"]
export type Lang = typeof _default
const _default = {
	displayName: "",
	tts: {
		prefered_voices_URIs: []
	},
	steps: {
		pc_to_ram: "",
		ram_to_ir: "",
		ir_to_cu: "",
		cu_to_mux: "",
		cu_to_alu: "",
		acc_to_alu1: "",
		pc_increment: "",
		ir_to_alu2: "",
		ir_to_ram: "",
		memory_read: "",
		memory_fetch: "",
		memory_write: "",
		ram_to_alu2: "",
		ir_to_pc: "",
		execute: "",
		alu_to_sw: "",
		acc_to_ram: "",
		acc_stored_to_ram: ""
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
	},
	errors: {
		program_parsing: {
			invalid_syntax: "",
			parsing_error: ""
		},
		instruction_parsing: {
			invalid_binary_input: "",
			invalid_symbolic_input: "",
			invalid_opcode: "",
			operand_not_allowed: "",
			operand_required: "",
			unknown_label: "",
			immediate_operand_not_allowed: "",
			invalid_immediate_operand: "",
			invalid_direct_operand: "",
			invalid_data: ""
		},
		symbol_table: {
			label_already_exists: ""
		},
		user_input: {
			invalid_file_name: ""
		}
	}
}

export const lang = writable<Lang>(_default)

fetchText(get(language))
language.subscribe(fetchText)

export function fetchText(_lang: SupportedLang) {
	fetch(`resources/lang/${_lang}.json`)
		.then(res => res.json())
		.then(data => lang.set(data as Lang))
}

export default lang
