import { get } from "svelte/store"
import { writable } from "../util/customStores"
import { language } from "./settings"
import { parse as parseYaml } from "yaml"
import { Language } from "../../shared/util/i18n"
import logger, { LogCategory } from "../util/logger"

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
				title: "",
				save_to_file: {
					text: "",
					title: ""
				},
				save_to_url: {
					text: "",
					title: ""
				}
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
			},
			copyright: {
				text: "",
				title: ""
			}
		},
		overlays: {
			save_to_file: {
				title: "",
				buttons: {
					save: {
						text: "",
						title: ""
					},
					cancel: {
						text: "",
						title: ""
					}
				},
				inputs: {
					filename: {
						placeholder: ""
					}
				}
			},
			save_to_url: {
				title: "",
				copied: "",
				buttons: {
					copy_to_clipboard: {
						text: "",
						title: ""
					}
				}
			},
			copyright: {
				subsections: {
					copyright_notice: {
						title: "",
						paragraphs: [],
						disclaimer: ""
					},
					credits: {
						title: "",
						paragraphs: []
					}
				}
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
			play_program: {
				title: ""
			},
			pause_program: {
				title: ""
			},
			fast_program: {
				title: ""
			},
			play_step: {
				title: ""
			},
			fast_step: {
				title: ""
			},
			play_instruction: {
				title: ""
			},
			fast_instruction: {
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
			invalid_instruction: "",
			invalid_label: "",
			duplicated_label: ""
		},
		instruction_parsing: {
			invalid_binary_input: "",
			invalid_opcode: "",
			invalid_operand: "",
			operand_not_allowed: "",
			operand_required: "",
			unknown_label: "",
			immediate_operand_not_allowed: "",
			invalid_immediate_operand: "",
			invalid_direct_operand: "",
			invalid_data: ""
		},
		label_parsing: {
			invalid_character: "",
			label_too_short: "",
			label_too_long: ""
		},
		symbol_table: {
			label_already_exists: "",
			invalid_label: ""
		},
		user_input: {
			invalid_file_name: "",
			invalid_pc_value: "",
			invalid_acc_value: ""
		},
		execution: {
			invalid_instruction: "",
			division_by_zero: ""
		},
		generic: {
			fetch_error: ""
		}
	}
}

export const text = writable<Lang>(_default)

export async function fetchText(_lang: Language) {
	logger.debug(`Fetching text - Lang: ${_lang}`, LogCategory.INIT)
	await fetch(`resources/i18n/app/${_lang}.yaml`)
		.then(res => res.text())
		.then(text => parseYaml(text))
		.then(data => text.set(data as Lang))
		.catch(error => logger.unexpected_error(error.message, LogCategory.INIT))
	logger.debug("Text fetched", LogCategory.INIT)
}

export async function init() {
	logger.debug("Initializing text", LogCategory.INIT)
	await fetchText(get(language))
	// note: svelte stores subscribe method triggers the callback.
	// This means that the callback is executed even if the store value didn't change.
	// So in this case fetchText is called (unnecessarily) 2 times.
	// Unfortunatelly the fetchText that is awaited is necessary, since
	language.subscribe(fetchText)
	logger.debug("Text initialized", LogCategory.INIT)
}

export default text
