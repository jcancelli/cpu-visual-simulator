import { get, writable } from "svelte/store"
import { language, SupportedLang } from "./settings"

export type Step = keyof Lang["steps"]
export type Lang = typeof _default
const _default = {
	displayName: "",
	steps: {
		pc_to_ram: {
			tts: "",
			text: ""
		},
		ram_to_ir: {
			tts: "",
			text: ""
		},
		ir_to_cu: {
			tts: "",
			text: ""
		},
		cu_to_mux: {
			tts: "",
			text: ""
		},
		cu_to_alu: {
			tts: "",
			text: ""
		},
		acc_to_alu1: {
			tts: "",
			text: ""
		},
		pc_increment: {
			tts: "",
			text: ""
		},
		ir_to_alu2: {
			tts: "",
			text: ""
		},
		ir_to_ram: {
			tts: "",
			text: ""
		},
		memory_read: {
			tts: "",
			text: ""
		},
		memory_fetch: {
			tts: "",
			text: ""
		},
		memory_write: {
			tts: "",
			text: ""
		},
		ram_to_alu2: {
			tts: "",
			text: ""
		},
		ir_to_pc: {
			tts: "",
			text: ""
		},
		execute: {
			tts: "",
			text: ""
		},
		alu_to_sw: {
			tts: "",
			text: ""
		},
		acc_to_ram: {
			tts: "",
			text: ""
		},
		acc_stored_to_ram: {
			tts: "",
			text: ""
		}
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
	message_feed: {
		buttons: {
			export_logs: {
				text: ""
			},
			close_message: {
				title: ""
			}
		}
	},
	settings: {
		title: "",
		language: {
			title: "",
			description: ""
		},
		dispaly_labels: {
			title: "",
			description: ""
		},
		tts_enabled: {
			title: "",
			description: ""
		},
		tts_speed: {
			title: "",
			description: ""
		},
		tts_voice: {
			title: "",
			description: ""
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
