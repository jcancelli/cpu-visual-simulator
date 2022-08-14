import { get } from "svelte/store"
import ProgramParsingError from "../errors/ProgramParsingError"
import Instruction from "../instruction/Instruction"
import {
	LABEL_PARAM as LABEL,
	SYMBOLIC_INSTRUCTION as INSTRUCTION_PATTERN,
	DATA as DATA_PATTERN,
	parseSymbolic
} from "../instruction/instructionParser"
import text from "../store/text"
import { FIRST_ADDRESS, LAST_ADDRESS, WORD_SIZE } from "./ramUtil"
import { interpolate } from "../../shared/util/template"

type RawInstruction = {
	text: string
	lineNumber: number
	address: number
}
type ProgramParsingOutput = {
	instructions: Instruction[]
	labels: string[]
}

const COMMENT_PATTERN = /;.*/g
const LABEL_PATTERN = new RegExp(":" + LABEL.source)
const VALID_LINE_PATTERN = new RegExp(
	`^(${INSTRUCTION_PATTERN.source.replace(/\^|\$/g, "")}|${DATA_PATTERN.source.replace(/\^|\$/g, "")})( ${
		LABEL_PATTERN.source
	})?$`
)

export function compileProgram(program: string): ProgramParsingOutput {
	const lines = program.split(/\r\n|\r|\n/g)
	const rawInstructions: RawInstruction[] = []
	const labels: string[] = []
	let address = FIRST_ADDRESS
	lines.forEach((rawLine: string, index: number) => {
		const lineNumber = index + 1
		const line = rawLine.replace(COMMENT_PATTERN, "").replace(/\s+/g, " ").trim()
		if (line === "") {
			return
		}
		if (!VALID_LINE_PATTERN.test(line)) {
			const badInput = line.length > 30 ? `${line.slice(0, 30)}...` : line
			throw new ProgramParsingError(
				interpolate(get(text).errors.program_parsing.invalid_syntax, lineNumber, badInput)
			)
		}
		const [rawInstruction, label] = line.split(":").map(token => token.trim())
		rawInstructions.push({
			text: rawInstruction,
			lineNumber,
			address
		})
		if (label && labels.includes(label)) {
			throw new ProgramParsingError(
				interpolate(get(text).errors.program_parsing.duplicate_label, lineNumber, label)
			)
		}
		labels[address] = label
		address += WORD_SIZE
	})
	address = FIRST_ADDRESS
	const instructions: Instruction[] = []
	rawInstructions.forEach((rawInstruction: RawInstruction) => {
		try {
			instructions[rawInstruction.address] = parseSymbolic(rawInstruction.text, labels)
		} catch (error) {
			throw new ProgramParsingError(
				interpolate(get(text).errors.program_parsing.parsing_error, rawInstruction.lineNumber, error.message)
			)
		}
	})
	return {
		instructions,
		labels
	}
	// Note: both instructions and labels values are at the same index as their addresses, so not every index is valorized
}

export function exportProgram(instructions: Instruction[], labels: string[]): string {
	const LABEL_COLUMN = 20
	let output = ""
	let instruction = ""
	let space = ""
	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		instruction = instructions[address].symbolic()
		output += `\t${instruction}`
		space = " ".repeat(LABEL_COLUMN - instruction.length)
		if (labels[address]) {
			output += `${space}:${labels[address]}`
		}
		output += "\n"
	}
	output = output.replace(/(\tNOP\n)*$/g, "").replace(/\n$/g, "")
	return output
}
