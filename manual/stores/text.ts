import { get, writable } from "svelte/store"
import { language, SupportedLang } from "../../src/store/settings"
import { parse as parseYaml } from "yaml"

export type Text = typeof _default

const _default = {
	title: "",
	sections: {
		instruction_set: {
			title: ""
		},
		controls: {
			title: ""
		},
		examples: {
			title: ""
		},
		credits: {
			title: ""
		}
	},
	opcodes_table: {
		sections_titles: {
			control_flow: "",
			data_flow: "",
			arithmetic_logic: ""
		},
		descriptions: {
			NOP: "",
			HLT: "",
			JMP: "",
			JZ: "",
			JNZ: "",
			JN: "",
			JNN: "",
			LOD: "",
			STO: "",
			ADD: "",
			SUB: "",
			MUL: "",
			DIV: "",
			AND: "",
			CMP: "",
			NOT: ""
		}
	}
}

export const text = writable<Text>(_default)

fetchText(get(language))
language.subscribe(fetchText)

export function fetchText(_lang: SupportedLang) {
	fetch(`resources/i18n/manual/${_lang}.yaml`)
		.then(res => res.text())
		.then(text => parseYaml(text))
		.then(data => text.set(data as Text))
}

export default text
