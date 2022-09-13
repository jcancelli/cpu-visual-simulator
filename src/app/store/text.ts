import { get, writable } from "svelte/store"
import { language } from "./settings"
import { parse as parseYaml } from "yaml"
import { Language } from "../../shared/util/i18n"

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
	cpu: {
		ir: {
			invalid_instruction: ""
		}
	},
	ram: {
		buttons: {
			clear: {
				text: "",
				title: ""
			},
			undo: {
				title: ""
			},
			redo: {
				title: ""
			}
		}
	},
	menu: {
		buttons: {
			settings: {
				text: "",
				title: ""
			},
			save: {
				text: "",
				title: ""
			},
			load: {
				text: "",
				title: ""
			},
			examples: {
				text: "",
				title: "",
				examples: {
					if_then_else: {
						text: "",
						title: ""
					},
					while_do: {
						text: "",
						title: ""
					},
					array_sum: {
						text: "",
						title: ""
					}
				}
			},
			manual: {
				text: "",
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
		sections_titles: {
			general: "",
			tts: "",
			busses: ""
		},
		language: {
			title: "",
			description: ""
		},
		dispaly_components_labels: {
			title: "",
			description: ""
		},
		dispaly_busses_labels: {
			title: "",
			description: ""
		},
		display_step_text: {
			title: "",
			description: ""
		},
		reset_all: {
			title: "",
			description: "",
			button: {
				text: ""
			}
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
		},
		databus_ext_color: {
			title: "",
			description: ""
		},
		databus_int_color: {
			title: "",
			description: ""
		},
		databus_ext_anim_color: {
			title: "",
			description: ""
		},
		databus_int_anim_color: {
			title: "",
			description: ""
		},
		addressbus_ext_color: {
			title: "",
			description: ""
		},
		addressbus_int_color: {
			title: "",
			description: ""
		},
		addressbus_ext_anim_color: {
			title: "",
			description: ""
		},
		addressbus_int_anim_color: {
			title: "",
			description: ""
		},
		controlbus_ext_color: {
			title: "",
			description: ""
		},
		controlbus_int_color: {
			title: "",
			description: ""
		},
		controlbus_ext_anim_color: {
			title: "",
			description: ""
		},
		controlbus_int_anim_color: {
			title: "",
			description: ""
		}
	},
	errors: {
		unchecked: "",
		program_parsing: {
			invalid_syntax: "",
			parsing_error: "",
			duplicate_label: ""
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
			invalid_file_name: "",
			invalid_pc_value: "",
			invalid_acc_value: ""
		},
		execution: {
			invalid_instruction: "",
			division_by_zero: ""
		}
	}
}

export const text = writable<Lang>(_default)

export function fetchText(_lang: Language) {
	fetch(`resources/i18n/app/${_lang}.yaml`)
		.then(res => res.text())
		.then(text => parseYaml(text))
		.then(data => text.set(data as Lang))
}

export function init() {
	fetchText(get(language))
	language.subscribe(fetchText)
}

export default text
