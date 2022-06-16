export const SUPPORTED_LANGS = ["en"] as const
export const DEFAULT_LANG = "en"
export type SupportedLang = typeof SUPPORTED_LANGS[number]
export type Texts = {
	[key in SupportedLang]: Text
}
export interface Text {
	displayName: string
	steps: {
		pc_to_ram: string
		memory_fetch: string
		instruction_to_ir: string
		opcode_to_decoder: string
		cu_sets_mux: string
		cu_sets_operation: string
		acc_to_alu1: string
		pc_increment: string
	}
}
export type Steps = {
	[key in Step]: string
}
export type Step = keyof Text["steps"]

const texts: Texts = {
	en: {
		displayName: "English",
		steps: {
			pc_to_ram: "The value of the Program Counter is put on the address bus",
			memory_fetch: "A memory fetch signal is sent to the RAM",
			instruction_to_ir: "The instruction is loaded into the Instruction Register",
			opcode_to_decoder: "The opcode is sent to the Decoder",
			cu_sets_mux: "The Control Unit sets wether the operaand is direct or immediate",
			cu_sets_operation: "The Control Unit sets the operation",
			acc_to_alu1: "The Accumulator is loaded in the ALU",
			pc_increment: "The Program Counter is incremented"
		}
	}
} as const

export function getDefaultLanguage(): SupportedLang {
	let lang = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
	lang = lang.split("-")[0]
	return SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG
}

export default texts
