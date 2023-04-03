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
import logger, { LogCategory } from "./util/logger"

let app: App

main()

export default app

async function main(): Promise<void> {
	logger.debug("Instantiating models", LogCategory.INIT)
	const ram = new Ram()
	const cpu = new Cpu()
	const symbolTable = new SymbolTable()
	const wires = new Wires()
	const messageFeedState = new MessageFeed()
	logger.debug("Models instantiated", LogCategory.INIT)

	logger.debug("Setting model's stores", LogCategory.INIT)
	ramStore.set(ram)
	cpuStore.set(cpu)
	symbolTableStore.set(symbolTable)
	wiresStore.set(wires)
	messageFeedStore.set(messageFeedState)
	logger.debug("Model's stores setted", LogCategory.INIT)

	logger.debug("Subscribing symbol table change synchers", LogCategory.INIT)
	// when a label is edited in the symbol table, all its occurences in the ram are synched
	symbolTable.addLabelEditedListener(event => ram.updateLabel(event.oldLabel, event.newLabel))
	symbolTable.addLabelEditedListener(event => {
		logger.debug(
			`Label edited - oldValue: "${event.oldLabel}" newValue: "${event.newLabel}"`,
			LogCategory.INIT
		)
	})
	// when a label is moved in the symbol table, all its occurences in the ram are synched
	symbolTable.addLabelMovedListener(event => ram.updateLabelAddress(event.label, event.newAddress))
	symbolTable.addLabelMovedListener(event => {
		logger.debug(
			`Label moved - label: "${event.label}" oldAddress: "${event.oldAddress}" newAddress: "${event.newAddress}"`,
			LogCategory.INIT
		)
	})
	// when a label is deleted from the symbol table, all its occurences in the ram are replaced by the address that label was mapped to
	symbolTable.addLabelRemovedListener(event => ram.removeLabel(event.removedLabel))
	symbolTable.addLabelRemovedListener(event => {
		logger.debug(
			`Label removed - label: "${event.removedLabel}" address: "${event.address}"`,
			LogCategory.INIT
		)
	})
	logger.debug("Symbol table change synchers subscribed", LogCategory.INIT)

	// when the state of the ram or of the symbol table is altered, the program stored in them is saved to local storage
	logger.debug("Subscribing local storage program synchers", LogCategory.INIT)
	ram.instructions.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))
	symbolTable.labels.subscribe(newState => storage.set("program", exportProgram(ram, symbolTable)))
	logger.debug("Local storage program synchers subscribed", LogCategory.INIT)

	await initSettings()
	await initText()
	await messageFeedState.fetchMessages("resources/messages.yaml")

	logger.debug("Instantiating program execution and program execution loop", LogCategory.INIT)
	const programExecution = new ProgramExecution(cpu, ram, symbolTable, wires)
	const programExecutionLoop = new NonBlockingLoop(programExecution, 20)
	logger.debug("Program execution and program execution loop instantiated", LogCategory.INIT)

	logger.debug("Setting program execution and program execution loop stores", LogCategory.INIT)
	programExecutionStore.set(programExecution)
	programExecutionLoopStore.set(programExecutionLoop)
	logger.debug("Program execution and program execution loop stores setted", LogCategory.INIT)

	logger.debug("Instantiating App", LogCategory.INIT)

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
				logger.debug("Initializing execution context", LogCategory.INIT)

				logger.debug("Fetching ui components from stores", LogCategory.INIT)
				const cpuComponent = cpuComponentStore.get()
				const ramComponent = ramComponentStore.get()
				const wiresComponent = wiresComponentStore.get()
				const stepTextComponent = stepTextComponentStore.get()
				if (!cpuComponent) throw new Error("cpu component not yet initialized")
				if (!ramComponent) throw new Error("ram component not yet initialized")
				if (!wiresComponent) throw new Error("wires component not yet initialized")
				if (!stepTextComponent) throw new Error("step text component not yet initialized")
				logger.debug("Ui components fetched", LogCategory.INIT)

				logger.debug("Passing ui components to executionContext", LogCategory.INIT)
				programExecution.executionContext.cpu.component = cpuComponent
				programExecution.executionContext.ram.component = ramComponent
				programExecution.executionContext.wires.component = wiresComponent
				programExecution.executionContext.stepTextComponent = stepTextComponent
				logger.debug("Ui components passed to executionContext", LogCategory.INIT)

				logger.debug("Starting execution loop", LogCategory.INIT)
				programExecutionLoop.start()
				logger.debug("Execution loop started", LogCategory.INIT)

				logger.debug("Execution context initialized", LogCategory.INIT)
			}
		}
	})
	logger.debug("App instantiated", LogCategory.INIT)

	// check url params for base64 encoded program
	logger.debug("Checking url params for base64 encoded program", LogCategory.INIT, LogCategory.USER_INPUT)
	const urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has("program")) {
		// loads program from base64 encoded query param "program"
		logger.debug("Base64 encoded program found in page url", LogCategory.INIT, LogCategory.USER_INPUT)
		try {
			const base64EncodedProgram = urlParams.get("program")
			logger.debug(
				`Loading program from url: ${base64EncodedProgram}`,
				LogCategory.INIT,
				LogCategory.USER_INPUT
			)
			const program = parseProgram(window.atob(base64EncodedProgram))
			ram.import(program.ram)
			symbolTable.import(program.symbolTable)
		} catch (error) {
			messageFeedState.error(error.message)
			logger.handled_error(error.message, LogCategory.INIT, LogCategory.USER_INPUT)
		}
		logger.debug("Base64 encoded program loaded", LogCategory.INIT, LogCategory.USER_INPUT)
	} else {
		// loads the program stored in local storage into the ram (restores previous session)
		logger.debug("No base64 encoded program found in the page url", LogCategory.INIT)
		logger.debug("Loading program from local storage", LogCategory.INIT)
		const program = parseProgram(storage.getOrElse("program", "NOP"))
		ram.import(program.ram)
		symbolTable.import(program.symbolTable)
		logger.debug("Program from local storage loaded", LogCategory.INIT)
	}
}
