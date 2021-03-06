import { get } from "svelte/store"
import ProgramParsingError from "../errors/ProgramParsingError"
import Instruction from "../instruction/Instruction"
import {
	LABEL_PARAM as LABEL,
	SYMBOLIC_INSTRUCTION as INSTRUCTION_PATTERN,
	DATA as DATA_PATTERN,
	parse
} from "../instruction/instructionParser"
import ramStore from "../store/ram"
import symbolTable from "../store/symbolTable"
import lang from "../store/lang"
import { FIRST_ADDRESS, indexToAddress, LAST_ADDRESS, WORD_SIZE } from "./ramUtil"
import { interpolate } from "./template"

type RawInstruction = {
	text: string
	lineNumber: number
	address: number
}

const COMMENT_PATTERN = /;.*/g
const LABEL_PATTERN = new RegExp(":" + LABEL.source)
const VALID_LINE_PATTERN = new RegExp(
	`^(${INSTRUCTION_PATTERN.source.replace(/\^|\$/g, "")}|${DATA_PATTERN.source.replace(
		/\^|\$/g,
		""
	)})( ${LABEL_PATTERN.source})?$`
)

export function load(raw: string): void {
	const lines = raw.split(/\r\n|\r|\n/g)
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
				interpolate(get(lang).errors.program_parsing.invalid_syntax, lineNumber, badInput)
			)
		}
		const [rawInstruction, label] = line.split(":").map(token => token.trim())
		rawInstructions.push({
			text: rawInstruction,
			lineNumber,
			address
		})
		labels[address] = label
		address += WORD_SIZE
	})
	address = FIRST_ADDRESS
	const instructions: Instruction[] = []
	rawInstructions.forEach((rawInstruction: RawInstruction) => {
		try {
			const instruction = parse(rawInstruction.text, false, labels)
			instructions.push(instruction)
		} catch (error) {
			throw new ProgramParsingError(
				interpolate(
					get(lang).errors.program_parsing.parsing_error,
					rawInstruction.lineNumber,
					error.message
				)
			)
		}
	})
	symbolTable.load(labels)
	ramStore.clear()
	instructions.forEach((instruction: Instruction, index: number) => {
		ramStore.write(indexToAddress(index), instruction)
	})
}

export function save(): string {
	const LABEL_COLUMN = 20
	let output = ""
	let instruction = ""
	let space = ""
	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		instruction = ramStore.read(address).symbolic()
		output += `\t${instruction}`
		space = " ".repeat(LABEL_COLUMN - instruction.length)
		if (symbolTable.getLabel(address)) {
			output += `${space}:${symbolTable.getLabel(address)}`
		}
		output += "\n"
	}
	output = output.replace(/(\tNOP\n)*$/g, "").replace(/\n$/g, "")
	return output
}
