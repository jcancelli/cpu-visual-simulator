<script lang="ts">
	import { get } from "svelte/store"
	import execution from "../execution/execution"
	import displaySettingsStore from "../store/displaySettingsStore"
	import ramStore from "../store/ramStore"
	import symbolTableStore from "../store/symbolTableStore"
	import components, { cpu, messageFeed, ram } from "../store/componentsStore"
	import debugStore from "../store/debugStore"
	import { isValidAddress } from "../util/ramUtil"
	import Nodes, { node } from "../wires/Nodes"
	import { MessageType } from "./MessageFeed.svelte"
	import cpuStore from "../store/cpuStore"
	import { parse } from "../instruction/instructionParser"
	import { FlashableCpuComponent } from "../execution/actions/animations/FlashCpu"
	import { onMount } from "svelte"

	let div: HTMLDivElement

	let numberInput = ""
	let stringInput = ""

	let fromNode: string
	let toNode: string

	let messageType: MessageType

	let cpuComponent: FlashableCpuComponent

	$: inputValue = parseInt(numberInput)

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.altKey && e.key === "d") {
				debugStore.updateShowDebugger(oldValue => !oldValue)
			}
		}
		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	})

	function closeDebugger() {
		debugStore.setShowDebugger(false)
	}

	function changePosition(position: "top" | "right" | "bottom" | "left") {
		switch (position) {
			case "top":
				div.style.top = "0"
				div.style.bottom = "auto"
				break
			case "right":
				div.style.right = "0"
				div.style.left = "auto"
				break
			case "bottom":
				div.style.bottom = "0"
				div.style.top = "auto"
				break
			case "left":
				div.style.left = "0"
				div.style.right = "auto"
				break
		}
	}

	function toggleBinary() {
		displaySettingsStore.updateBinary(bin => !bin)
	}

	function toggleLabels() {
		displaySettingsStore.updateShowLabels(val => !val)
	}

	function toggleNodes() {
		debugStore.updateShowNodes(val => !val)
	}

	function toggleNodeNames() {
		debugStore.updateShowNodeNames(val => !val)
	}

	function toggleNodeCoordinates() {
		debugStore.updateShowNodeCoordinates(val => !val)
	}

	function showAddress() {
		if (isValidAddress(inputValue)) {
			$ram.showAddress(inputValue)
		}
	}

	function flashAddress() {
		if (isValidAddress(inputValue)) {
			$ram.flashAddress(inputValue)
		}
	}

	function flashContent() {
		if (isValidAddress(inputValue)) {
			$ram.flashContent(inputValue)
		}
	}

	function clearRam() {
		ramStore.clear()
		symbolTableStore.clear()
	}

	function dumpRam() {
		console.log("--- RAM CONTENT ----------------")
		console.dir($ramStore)
		console.log("--------------------------------")
	}

	function setAcc() {
		cpuStore.setACC(inputValue)
	}

	function setPc() {
		cpuStore.setPC(inputValue)
	}

	function setIr() {
		cpuStore.setIR(parse(stringInput, false))
	}

	function setAlu1() {
		cpuStore.setALU1(inputValue)
	}

	function setAlu2() {
		cpuStore.setALU2(inputValue)
	}

	function setAluOp() {
		const operations = ["+", "-", "*", "/", ":", "!", "&", "=", ""]
		if (!operations.includes(stringInput)) {
			return
		}
		cpuStore.setOperation(stringInput as "+" | "-" | "*" | "/" | ":" | "!" | "&" | "=" | "")
	}

	function setSWZ() {
		cpuStore.setZeroFlag(!!numberInput)
	}

	function setSWN() {
		cpuStore.setNegativeFlag(!!numberInput)
	}

	function flashCpu() {
		$cpu.flash(cpuComponent)
	}

	function flashWire() {
		if (!node(fromNode) || !node(toNode)) {
			return
		}
		get(components.wires).flashWire(fromNode, toNode)
	}

	function showMessage() {
		$messageFeed.message(messageType, stringInput)
	}
</script>

{#if $debugStore.showDegugger}
	<div class="debug" bind:this={div}>
		<h2>Debugger</h2>
		<button on:click={closeDebugger} class="close-debugger" title="Close">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 0 24 24"
				width="24px"
				fill="#FFFFFF"
			>
				<path d="M0 0h24v24H0V0z" fill="none" />
				<path
					d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
				/>
			</svg>
		</button>
		<fieldset>
			<legend>Input</legend>
			<input type="number" bind:value={numberInput} placeholder="Number input" />
			<input type="text" bind:value={stringInput} placeholder="String input" />
		</fieldset>
		<fieldset>
			<legend>Execution</legend>
			<button on:click={execution.start}>Start</button>
			<button on:click={execution.pause}>Pause</button>
			<button on:click={execution.step}>Step</button>
			<button on:click={execution.instruction}>Instruction</button>
			<button on:click={execution.reset}>Reset</button>
		</fieldset>
		<fieldset>
			<legend>RAM</legend>
			<button on:click={clearRam}>Clear</button>
			<button on:click={dumpRam}>Dump</button>
		</fieldset>
		<fieldset>
			<legend>RAM Animation</legend>
			<button on:click={showAddress}>Show address</button>
			<button on:click={flashAddress}>Flash address</button>
			<button on:click={flashContent}>Flash data</button>
			<button on:click={$ram.scrollUp}>Scroll Up</button>
			<button on:click={$ram.scrollDown}>Scroll Down</button>
		</fieldset>
		<fieldset>
			<legend>CPU</legend>
			<button on:click={setAcc}>Set ACC</button>
			<button on:click={setPc}>Set PC</button>
			<button on:click={setIr}>Set IR</button>
			<button on:click={setAlu1}>Set ALU1</button>
			<button on:click={setAlu2}>Set ALU2</button>
			<button on:click={setAluOp}>Set ALU op</button>
			<button on:click={setSWZ}>Set SWZ</button>
			<button on:click={setSWN}>Set SWN</button>
		</fieldset>
		<fieldset>
			<legend>CPU Animation</legend>
			<select bind:value={cpuComponent}>
				{#each ["IR", "IR:OPC", "IR:OPR", "PC", "INC", "MUX", "CU", "ALU:1", "ALU:2", "ALU:OPR", "ACC", "SW:Z", "SW:N"] as component}
					<option value={component}>{component}</option>
				{/each}
			</select>
			<button on:click={flashCpu}>Flash component</button>
		</fieldset>
		<fieldset>
			<legend>Dispaly</legend>
			<button on:click={toggleBinary}>
				{$displaySettingsStore.binary ? "Symbolic" : "Binary"}
			</button>
			<button on:click={toggleLabels}>
				{$displaySettingsStore.showLabels ? "No-Labels" : "Labels"}
			</button>
		</fieldset>
		<fieldset>
			<legend>Nodes</legend>
			<button on:click={toggleNodes}>
				{$debugStore.showNodes ? "Hide" : "Show"}
			</button>
			<button on:click={toggleNodeNames} disabled={!$debugStore.showNodes}>
				{$debugStore.showNodeNames ? "No-Names" : "Names"}
			</button>
			<button on:click={toggleNodeCoordinates} disabled={!$debugStore.showNodes}>
				{$debugStore.showNodesCoordinates ? "No-Coordinates" : "Coordinates"}
			</button>
		</fieldset>
		<fieldset>
			<legend>Wires</legend>
			<select bind:value={fromNode}>
				{#each Nodes as node}
					<option value={node.name}>{node.name}</option>
				{/each}
			</select>
			<select bind:value={toNode}>
				{#each Nodes as node}
					<option value={node.name}>{node.name}</option>
				{/each}
			</select>
			<button on:click={flashWire}>Flash</button>
		</fieldset>
		<fieldset>
			<legend>Message</legend>
			<select bind:value={messageType}>
				{#each ["ERROR", "WARNING", "SUCCESS", "INFO"] as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
			<button on:click={showMessage}>Show</button>
		</fieldset>
		<fieldset>
			<legend>Position</legend>
			<button on:click={() => changePosition("left")}>Left</button>
			<button on:click={() => changePosition("top")}>Top</button>
			<button on:click={() => changePosition("bottom")}>Bottom</button>
			<button on:click={() => changePosition("right")}>Right</button>
		</fieldset>
	</div>
{/if}

<style lang="scss">
	@import "../style/variables.scss";

	.debug {
		position: fixed;
		top: 0;
		left: 0;
		width: 250px;
		max-height: 100vh;
		overflow-y: auto;
		background-color: black;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		padding: 10px;
		color: white;
		filter: opacity(60%);
	}

	.close-debugger {
		background-color: transparent;
		position: absolute;
		top: 0;
		right: 5px;
		border: 0;
		outline: 0;
		color: white;
		font-size: 20px;
		cursor: pointer;
	}

	h2 {
		font-size: large;
		align-self: center;
	}

	input[type="number"],
	input[type="text"] {
		width: 100%;
	}

	fieldset {
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
	}

	button {
		cursor: pointer;
		padding: 2px;
	}
</style>
