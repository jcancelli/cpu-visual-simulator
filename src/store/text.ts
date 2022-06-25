import { get, writable } from "svelte/store"
import { language, SupportedLang } from "./settings"

export type Step = keyof Text["steps"]
export type Text = typeof text_default
const text_default = {
	displayName: "English",
	steps: {
		pc_to_ram: "The value of the Program Counter is put on the address bus",
		ram_to_ir: "The instruction is loaded into the Instruction Register",
		ir_to_cu: "The opcode is decoded",
		cu_to_mux: "The Control Unit sets wether the operand is direct or immediate",
		cu_to_alu: "The Control Unit sets the operation",
		acc_to_alu1: "The Accumulator is loaded in the ALU",
		pc_increment: "The Program Counter is incremented",
		ir_to_alu2: "The second operand is loaded from the Instruction Register",
		ir_to_ram: "The operand is put on the address bus",
		memory_read: "A memory read signal is sent to the RAM",
		memory_fetch: "A memory fetch signal is sent to the RAM",
		memory_write: "A memory write signal is sent to the RAM",
		ram_to_alu2: "The second operand is loaded from the RAM",
		ir_to_pc: "The Program Counter is set to the Instruction Register operand value",
		execute: "The operation is executed",
		alu_to_sw: "The Status Word is updated",
		acc_to_ram: "The value of the Accumulator is put on the data bus",
		acc_stored_to_ram: "The value of the Accumulator is written into the RAM"
	},
	menu: {
		buttons: {
			settings: {
				title: "Settings"
			},
			save: {
				title: "Save program"
			},
			open: {
				title: "Load program"
			},
			language: {
				title: "Language"
			},
			help: {
				title: "Help"
			}
		}
	},
	controls: {
		labels: {
			execution: "Execution",
			step: "Step",
			instruction: "Instruction",
			speed: "Speed"
		},
		buttons: {
			reset: {
				title: "Reset"
			},
			play: {
				title: "Play"
			},
			pause: {
				title: "Pause"
			},
			end: {
				title: "Skip to end"
			},
			play_step: {
				title: "Play step"
			},
			skip_step: {
				title: "Skip step"
			},
			play_instruction: {
				title: "Play instruction"
			},
			skip_instruction: {
				title: "Skip instruction"
			}
		},
		sliders: {
			speed: {
				title: "Speed"
			}
		},
		checkboxes: {
			binary: {
				text: "Binary"
			},
			animations: {
				text: "Animations"
			}
		}
	},
	errors: {
		program_parsing: {
			invalid_syntax: 'Invalid syntax at line {0}: "{1}"',
			parsing_error: 'Error on line {0}: "{1}"'
		},
		symbol_table: {
			label_already_exists: "Label already exists"
		},
		user_input: {
			invalid_file_name: "Invalid file name"
		}
	}
}

export const texts = writable<Text>(text_default)

fetchText(get(language))
language.subscribe(fetchText)

export function fetchText(lang: SupportedLang) {
	fetch(`resources/texts/${lang}.json`)
		.then(res => res.json())
		.then(data => texts.set(data as Text))
}

export default texts