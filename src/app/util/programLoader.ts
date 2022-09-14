import ProgramParsingError from "../errors/ProgramParsingError"
import {
	LABEL_PARAM as LABEL,
	SYMBOLIC_INSTRUCTION as INSTRUCTION_PATTERN,
	DATA as DATA_PATTERN,
	parseSymbolic
} from "./instructionParser"
import text from "../store/text"
import { FIRST_ADDRESS, LAST_ADDRESS, WORD_SIZE } from "./ramUtil"
import { interpolate } from "../../shared/util/template"
import SymbolTable from "../model/SymbolTable"
import Ram from "../model/Ram"

type RawInstruction = {
	text: string
	lineNumber: number
	address: number
}
type ProgramParsingOutput = {
	ram: Ram
	symbolTable: SymbolTable
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
	const symbolTable = new SymbolTable()
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
				interpolate(text.get().errors.program_parsing.invalid_syntax, lineNumber, badInput)
			)
		}
		const [rawInstruction, label] = line.split(":").map(token => token.trim())
		rawInstructions.push({
			text: rawInstruction,
			lineNumber,
			address
		})
		if (label && symbolTable.hasLabel(label)) {
			throw new ProgramParsingError(
				interpolate(text.get().errors.program_parsing.duplicate_label, lineNumber, label)
			)
		}
		symbolTable.setLabel(address, label)
		address += WORD_SIZE
	})
	address = FIRST_ADDRESS
	const ram = new Ram()
	rawInstructions.forEach((rawInstruction: RawInstruction) => {
		try {
			ram.write(rawInstruction.address, parseSymbolic(rawInstruction.text, symbolTable))
		} catch (error) {
			throw new ProgramParsingError(
				interpolate(text.get().errors.program_parsing.parsing_error, rawInstruction.lineNumber, error.message)
			)
		}
	})
	return {
		ram,
		symbolTable
	}
}

export function exportProgram(ram: Ram, symbolTable: SymbolTable): string {
	const LABEL_COLUMN = 20
	let output = ""
	let instruction = ""
	let space = ""
	for (let address = FIRST_ADDRESS; address <= LAST_ADDRESS; address += WORD_SIZE) {
		instruction = ram.read(address).symbolic()
		output += `\t${instruction}`
		space = " ".repeat(LABEL_COLUMN - instruction.length)
		if (symbolTable.addressIsLabeled(address)) {
			output += `${space}:${symbolTable.getLabel(address)}`
		}
		output += "\n"
	}
	output = output.replace(/(\tNOP\n)*$/g, "").replace(/\n$/g, "")
	return output
}
