import ProgramParsingError from "../errors/ProgramParsingError"
import text from "../store/text"
import { FIRST_ADDRESS, LAST_ADDRESS } from "./ram"
import { WORD_SIZE } from "./cpu"
import { interpolate } from "../../shared/util/template"
import SymbolTable from "../model/SymbolTable"
import Ram from "../model/Ram"
import { parseSymbolic } from "./instructionParser"
import { MAX_LABEL_LENGTH, validateLabel } from "./label"

const COMMENT_PATTERN = /;.*$/g
const LABEL_PATTERN = /^.*\s?:/

type RawInstruction = {
	text: string
	lineNumber: number
	address: number
}
type ProgramParsingOutput = {
	ram: Ram
	symbolTable: SymbolTable
}

export function parseProgram(input: string): ProgramParsingOutput {
	const ram = new Ram()
	const symbolTable = new SymbolTable()
	const lines = input.toUpperCase().split(/\r\n|\r|\n/g)

	const rawInstructions: RawInstruction[] = []

	for (let i = 0, lineNumber = 1, address = FIRST_ADDRESS; i < lines.length; i++, lineNumber++) {
		const line = reduceSpaces(removeComment(lines[i]).trim())
		if (line === "") {
			continue
		}
		if (isLabeled(line)) {
			const label = extractLabel(line)
			try {
				validateLabel(label) // throws error if invalid label
				if (symbolTable.hasLabel(label)) {
					throw new ProgramParsingError(
						interpolate(text.get().errors.program_parsing.duplicated_label, lineNumber, label)
					)
				} else {
					symbolTable.setLabel(address, label)
				}
			} catch (invalidLabelError) {
				throw new ProgramParsingError(
					interpolate(text.get().errors.program_parsing.invalid_label, lineNumber, invalidLabelError.message)
				)
			}
		}
		rawInstructions.push({
			text: extractInstruction(line),
			lineNumber,
			address
		})
		address += WORD_SIZE
	}

	for (let rawInstruction of rawInstructions) {
		try {
			ram.write(rawInstruction.address, parseSymbolic(rawInstruction.text, symbolTable))
		} catch (error) {
			throw new ProgramParsingError(
				interpolate(
					text.get().errors.program_parsing.invalid_instruction,
					rawInstruction.lineNumber,
					error.message
				)
			)
		}
	}

	return {
		ram,
		symbolTable
	}
}

export function exportProgram(ram: Ram, symbolTable: SymbolTable): string {
	let output = ""
	let instruction = ""
	let label = ""
	const indentation1 = ""
	let indentation2 = ""

	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		instruction = ram.read(address).symbolic()
		label = symbolTable.addressIsLabeled(address) ? `${symbolTable.getLabel(address)}:` : ""
		indentation2 = " ".repeat(MAX_LABEL_LENGTH + 1 + 4 - label.length)
		output += `${indentation1}${label}${indentation2}${instruction}\n`
	}

	return output.replace(/\n(\s*NOP\n)*$/g, "\n").replace(/\n$/g, "") // removes all trailing NOP
}

function removeComment(line: string): string {
	return line.replace(COMMENT_PATTERN, "")
}

function reduceSpaces(line: string): string {
	return line.replace(/\s+/g, " ")
}

function isLabeled(line: string): boolean {
	return LABEL_PATTERN.test(line)
}

/** line must contain a label */
function extractLabel(line: string): string {
	return line.split(":")[0].trim()
}

function extractInstruction(line: string): string {
	return isLabeled(line) ? line.split(":")[1].trim() : line
}
