import App from "./App.svelte"
import Cpu from "./model/Cpu"
import Ram from "./model/Ram"
import SymbolTable from "./model/SymbolTable"
import Wires from "./model/Wires"
import {
	cpuStore,
	messageFeedStore,
	programExecutionLoopStore,
	programExecutionStore,
	ramStore,
	symbolTableStore,
	wiresStore
} from "./store/state"
import {
	cpu as cpuComponentStore,
	ram as ramComponentStore,
	wires as wiresComponentStore,
	stepText as stepTextComponentStore
} from "./store/components"
import { init as initSettings } from "./store/settings"
import { init as initText } from "./store/text"
import ProgramExecution from "./execution/ProgramExecution"
import NonBlockingLoop from "./execution/NonBlockingLoop"
import { storage } from "./util/localStorage"
import { exportProgram, parseProgram } from "./util/programParser"
import MessageFeed from "./model/MessageFeed"
import Logger from "./util/logger"

let app: App

main()

export default app

async function main(): Promise<void> {
	Logger.info("Instantiating models", "DEBUG")
	const ram = new Ram()
	const cpu = new Cpu()
	const symbolTable = new SymbolTable()
	const wires = new Wires()
	const messageFeedState = new MessageFeed()
	Logger.info("Models instantiated", "DEBUG")

	Logger.info("Setting model's stores", "DEBUG")
	ramStore.set(ram)
	cpuStore.set(cpu)
	symbolTableStore.set(symbolTable)
	wiresStore.set(wires)
	messageFeedStore.set(messageFeedState)
	Logger.info("Model's stores setted", "DEBUG")

	Logger.info("Subscribing symbol table change synchers", "DEBUG")
	// when a label is edited in the symbol table, all its occurences in the ram are synched
	symbolTable.addLabelEditedListener(event => ram.updateLabel(event.oldLabel, event.newLabel))
	symbolTable.addLabelEditedListener(event => {
		Logger.info(`Label edited - oldValue: "${event.oldLabel}" newValue: "${event.newLabel}"`, "DEBUG")
	})
	// when a label is moved in the symbol table, all its occurences in the ram are synched
	symbolTable.addLabelMovedListener(event => ram.updateLabelAddress(event.label, event.newAddress))
	symbolTable.addLabelMovedListener(event => {
		Logger.info(
			`Label moved - label: "${event.label}" oldAddress: "${event.oldAddress}" newAddress: "${event.newAddress}"`,
			"DEBUG"
		)
	})
	// when a label is deleted from the symbol table, all its occurences in the ram are replaced by the address that label was mapped to
	symbolTable.addLabelRemovedListener(event => ram.removeLabel(event.removedLabel))
	symbolTable.addLabelRemovedListener(event => {
		Logger.info(`Label removed - label: "${event.removedLabel}" address: "${event.address}"`, "DEBUG")
	})
	Logger.info("Symbol table change synchers subscribed", "DEBUG")

	// when the state of the ram or of the symbol table is altered, the program stored in them is saved to local storage
	Logger.info("Subscribing local storage program synchers", "DEBUG")
	ram.instructions.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))
	symbolTable.labels.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))
	Logger.info("Local storage program synchers subscribed", "DEBUG")

	await initSettings()
	await initText()
	await messageFeedState.fetchMessages("resources/messages.yaml")

	Logger.info("Instantiating program execution and program execution loop", "DEBUG")
	const programExecution = new ProgramExecution(cpu, ram, symbolTable, wires)
	const programExecutionLoop = new NonBlockingLoop(programExecution, 20)
	Logger.info("Program execution and program execution loop instantiated", "DEBUG")

	Logger.info("Setting program execution and program execution loop stores", "DEBUG")
	programExecutionStore.set(programExecution)
	programExecutionLoopStore.set(programExecutionLoop)
	Logger.info("Program execution and program execution loop stores setted", "DEBUG")

	Logger.info("Instantiating App", "DEBUG")

	app = new App({
		target: document.body,
		props: {
			cpu,
			ram,
			symbolTable,
			programExecution,
			// programExecution needs to access the ui components of cpu, ram, etc to perform
			// actions that requires them (such as animations).
			// This callback is executed when the App component is mounted (therefore when the ui
			// components have already been created) so that it can pass the ui components references
			// to the programExecution.
			onMountCallback: () => {
				Logger.info("Initializing execution context", "DEBUG")

				const cpuComponent = cpuComponentStore.get()
				const ramComponent = ramComponentStore.get()
				const wiresComponent = wiresComponentStore.get()
				const stepTextComponent = stepTextComponentStore.get()

				if (!cpuComponent) throw new Error("cpu component not yet initialized")
				if (!ramComponent) throw new Error("ram component not yet initialized")
				if (!wiresComponent) throw new Error("wires component not yet initialized")
				if (!stepTextComponent) throw new Error("step text component not yet initialized")

				programExecution.executionContext.cpu.component = cpuComponent
				programExecution.executionContext.ram.component = ramComponent
				programExecution.executionContext.wires.component = wiresComponent
				programExecution.executionContext.stepTextComponent = stepTextComponent

				Logger.info("Starting execution loop", "DEBUG")
				programExecutionLoop.start()
				Logger.info("Execution loop started", "DEBUG")

				Logger.info("Execution context initialized", "DEBUG")
			}
		}
	})
	Logger.info("App instantiated", "DEBUG")

	// check url params for base64 encoded program
	Logger.info("Checking url params for base64 encoded program", "DEBUG")
	const urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has("program")) {
		// loads program from base64 encoded query param "program"
		Logger.info("Base64 encoded program found in page url", "DEBUG")
		try {
			const base64EncodedProgram = urlParams.get("program")
			Logger.info(`Loading program from url: ${base64EncodedProgram}`, "USER_INPUT")
			const program = parseProgram(window.atob(base64EncodedProgram))
			ram.import(program.ram)
			symbolTable.import(program.symbolTable)
		} catch (error) {
			messageFeedState.error(error.message)
			Logger.error(error, "USER_INPUT", error.isChecked)
		}
		Logger.info("Base64 encoded program loaded", "DEBUG")
	} else {
		// loads the program stored in local storage into the ram (restores previous session)
		Logger.info("No base64 encoded program found in the page url", "DEBUG")
		Logger.info("Loading program from local storage", "DEBUG")
		const program = parseProgram(storage.getOrElse("program", "NOP"))
		ram.import(program.ram)
		symbolTable.import(program.symbolTable)
		Logger.info("Program from local storage loaded", "DEBUG")
	}
}
