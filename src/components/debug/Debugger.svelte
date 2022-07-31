<script lang="ts">
	import { onMount } from "svelte"
	import { FlashableCpuComponent } from "../../execution/actions/animations/FlashCpu"
	import execution from "../../execution/execution"
	import Instruction from "../../instruction/Instruction"
	import { Operators } from "../../instruction/Opcode"
	import { cpu, messageFeed, ram, wires } from "../../store/components"
	import cpuStore, {
		accumulator,
		alu1,
		alu2,
		aluOperation,
		instructionRegister,
		negativeFlag,
		programCounter,
		zeroFlag
	} from "../../store/cpu"
	import { showDebugger, showNodes, showNodesNames, showNodesCoordinates } from "../../store/debug"
	import ramStore from "../../store/ram"
	import { displayAsBinary, displayLabels, language, SUPPORTED_LANGS, ttsEnabled } from "../../store/settings"
	import BinaryValue from "../../util/BinaryValue"
	import { set } from "../../util/localStorage"
	import SpeechSynthesis from "../../util/speechSynthesis"
	import Nodes from "../../wires/Nodes"
	import Button from "../basic/buttons/Debug.svelte"
	import Checkbox from "../basic/checkboxes/Debug.svelte"
	import Input from "../basic/inputs/Debug.svelte"
	import Select from "../basic/selects/Debug.svelte"
	import InstructionInput from "./InstructionInput.svelte"
	import Widget from "./Widget.svelte"

	onMount(() => {
		const toggleShortcutListener = (e: KeyboardEvent) => {
			if (e.altKey && e.key.toLowerCase() === "d") {
				e.preventDefault()
				toggleDebugger()
			}
		}
		window.addEventListener("keydown", toggleShortcutListener)
		return () => window.removeEventListener("keydown", toggleShortcutListener)
	})

	const flashableCpuComponents = [
		"IR",
		"IR:OPC",
		"IR:OPR",
		"PC",
		"INC",
		"MUX",
		"CU",
		"ALU:1",
		"ALU:2",
		"ALU:OPR",
		"ACC",
		"SW:Z",
		"SW:N"
	]

	let cpuInstruction: Instruction
	let cpuNumericValue: string
	let cpuOperation: Operators
	let cpuFlag = false
	let cpuFlashableComponent: FlashableCpuComponent

	let ramInstruction: Instruction
	let ramNumericValue: string

	let message: string

	let fromNode: string
	let toNode: string

	let ttsText: string

	let localStorageKey: string
	let localStorageValue: string

	function toggleDebugger() {
		$showDebugger = !$showDebugger
	}
</script>

{#if $showDebugger}
	<div class="fixed top-0 left-0 w-screen h-screen bg-black/50 text-white">
		<div class="w-full flex flex-wrap items-center justify-between p-4">
			<h1 class="text-xl">Debugger</h1>
			<button on:click={toggleDebugger} title="Close debugger">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="h-7 w-7 fill-white">
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<div class="w-full overflow-y-auto p-5 flex flex-wrap gap-8">
			<Widget title="Execution">
				<svelte:fragment slot="buttons">
					<Button on:click={() => execution.reset()}>Reset</Button>
					<Button on:click={() => execution.start()}>Play</Button>
					<Button on:click={() => execution.pause()}>Pause</Button>
					<Button on:click={() => execution.step()}>Step</Button>
					<Button on:click={() => execution.instruction()}>Instruction</Button>
					<Button disabled>Skip Step</Button>
					<Button disabled>Skip Instruction</Button>
				</svelte:fragment>
			</Widget>
			<Widget title="CPU">
				<svelte:fragment slot="inputs">
					<InstructionInput bind:value={cpuInstruction} />
					<Input type="number" bind:value={cpuNumericValue} placeholder="Value" />
					<div class="flex gap-1">
						<Select
							placeholder="Operation"
							options={["+", "-", "*", "/", ":", "!", "&", "="]}
							bind:value={cpuOperation}
						/>
						<Checkbox bind:checked={cpuFlag}>Flag</Checkbox>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => cpuStore.reset()}>Reset</Button>
					<Button on:click={() => instructionRegister.set(cpuInstruction)}>Set IR</Button>
					<Button on:click={() => programCounter.set(new BinaryValue(8, parseInt(cpuNumericValue)))}
						>Set PC</Button
					>
					<Button on:click={() => alu1.set(new BinaryValue(16, parseInt(cpuNumericValue)))}>Set ALU:1</Button>
					<Button on:click={() => alu2.set(new BinaryValue(16, parseInt(cpuNumericValue)))}>Set ALU:2</Button>
					<Button on:click={() => aluOperation.set(cpuOperation)}>Set ALU:OPR</Button>
					<Button on:click={() => accumulator.set(new BinaryValue(16, parseInt(cpuNumericValue)))}
						>Set ACC</Button
					>
					<Button on:click={() => zeroFlag.set(cpuFlag)}>Set SW:Z</Button>
					<Button on:click={() => negativeFlag.set(cpuFlag)}>Set SW:N</Button>
				</svelte:fragment>
			</Widget>
			<Widget title="CPU ANIMATION">
				<svelte:fragment slot="inputs">
					<Select
						placeholder="Flashable component"
						options={flashableCpuComponents}
						bind:value={cpuFlashableComponent}
					/>
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => $cpu.flash(cpuFlashableComponent)}>Flash</Button>
				</svelte:fragment>
			</Widget>
			<Widget title="RAM">
				<svelte:fragment slot="inputs">
					<Input type="number" bind:value={ramNumericValue} placeholder="Address" />
					<InstructionInput bind:value={ramInstruction} />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => $ram.flashAddress(parseInt(ramNumericValue))}>Flash address</Button>
					<Button on:click={() => $ram.flashContent(parseInt(ramNumericValue))}>Flash data</Button>
					<Button on:click={() => $ram.showAddress(parseInt(ramNumericValue))}>Show address</Button>
					<Button on:click={() => ramStore.clear()}>Clear</Button>
					<Button on:click={() => ramStore.write(parseInt(ramNumericValue), ramInstruction)}>Write</Button>
					<Button
						on:click={() => {
							console.log("--- RAM CONTENT ----------------")
							console.dir($ramStore)
							console.log("--------------------------------")
						}}>Dump</Button
					>
				</svelte:fragment>
			</Widget>
			<Widget title="MESSAGE">
				<svelte:fragment slot="inputs">
					<Input bind:value={message} />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => $messageFeed.error(message)}>Error</Button>
					<Button on:click={() => $messageFeed.warning(message)}>Warning</Button>
					<Button on:click={() => $messageFeed.success(message)}>Success</Button>
					<Button on:click={() => $messageFeed.info(message)}>Info</Button>
					<Button on:click={() => $messageFeed.bug(message)}>Bug</Button>
				</svelte:fragment>
			</Widget>
			<Widget title="WIRES">
				<svelte:fragment slot="inputs">
					<Select placeholder="From node" options={Nodes.map(node => node.name)} bind:value={fromNode} />
					<Select placeholder="To node" options={Nodes.map(node => node.name)} bind:value={toNode} />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => $wires.flashWire(fromNode, toNode)}>Flash</Button>
				</svelte:fragment>
			</Widget>
			<Widget title="NODES">
				<svelte:fragment slot="buttons">
					<Checkbox bind:checked={$showNodes}>Show nodes</Checkbox>
					<Checkbox bind:checked={$showNodesNames} disabled={!$showNodes}>Show names</Checkbox>
					<Checkbox bind:checked={$showNodesCoordinates} disabled={!$showNodes}>Show coordinates</Checkbox>
				</svelte:fragment>
			</Widget>
			<Widget title="DISPLAY">
				<svelte:fragment slot="inputs">
					<Select options={[...SUPPORTED_LANGS]} bind:value={$language} />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Checkbox bind:checked={$displayAsBinary}>Binary</Checkbox>
					<Checkbox bind:checked={$displayLabels}>Labels</Checkbox>
				</svelte:fragment>
			</Widget>
			<Widget title="TTS">
				<svelte:fragment slot="inputs">
					<Input bind:value={ttsText} placeholder="Utterance" />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => SpeechSynthesis.read(ttsText)}>Speak</Button>
					<Checkbox bind:checked={$ttsEnabled}>TTS Enabled</Checkbox>
				</svelte:fragment>
			</Widget>
			<Widget title="Local Storage">
				<svelte:fragment slot="inputs">
					<Input bind:value={localStorageKey} placeholder="Key" />
					<Input bind:value={localStorageValue} placeholder="Value" />
				</svelte:fragment>
				<svelte:fragment slot="buttons">
					<Button on:click={() => set(localStorageKey, localStorageValue)}>Set</Button>
					<Button on:click={() => localStorage.clear()}>Clear</Button>
				</svelte:fragment>
			</Widget>
		</div>
	</div>
{/if}
S
