<script lang="ts">
	import { minimalAnimations, displayAsBinary, animationSpeed, animationsEnabled } from "../../store/settings"
	import text from "../../store/text"
	import { stepText } from "../../store/components"
	import Widget from "./Widget.svelte"
	import ExecutionButton from "./ExecutionButton.svelte"
	import Checkbox from "./Checkbox.svelte"
	import Slider from "../../../shared/components/slider/Control.svelte"
	import Group from "./Group.svelte"
	import StepText from "./StepText.svelte"
	import Logger from "../../util/logger"
	import ProgramExecution from "../../execution/ProgramExecution"
	import ThreeStatesCheckbox, { State } from "./ThreeStatesCheckbox.svelte"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu
	export let programExecution: ProgramExecution

	const isProgramExecuting = programExecution.isExecuting

	function resetExecution() {
		Logger.info(`Reset pressed`, "USER_INPUT")
		programExecution.reset()
		cpu.reset()
	}

	function toggleExecution() {
		Logger.info(`Toggle execution pressed`, "USER_INPUT")
		programExecution.toggle()
	}

	function fastProgram() {
		Logger.info(`Skip execution pressed`, "USER_INPUT")
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.start()
	}

	function playStep() {
		Logger.info(`Play step pressed`, "USER_INPUT")
		programExecution.step()
	}

	function skipStep() {
		Logger.info(`Skip step pressed`, "USER_INPUT")
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.step()
	}

	function playInstruction() {
		Logger.info(`Play instruction pressed`, "USER_INPUT")
		programExecution.instruction()
	}

	function fastInstruction() {
		Logger.info(`Skip instruction pressed`, "USER_INPUT")
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.instruction()
	}

	function speedChanged() {
		Logger.info(`Speed slider moved - ${$animationSpeed}`, "USER_INPUT")
	}

	function binaryToggled() {
		Logger.info(`Binary toggle pressed - ${$displayAsBinary}`, "USER_INPUT")
	}

	function animationsToggled(event: CustomEvent) {
		switch (event.detail.value) {
			case State.OFF:
				$minimalAnimations = false
				$animationsEnabled = false
				break
			case State.HALF:
				$minimalAnimations = true
				$animationsEnabled = true
				break
			case State.ON:
				$minimalAnimations = false
				$animationsEnabled = true
				break
		}
		Logger.info(`Animations toggle pressed - ${event.detail.value}`, "USER_INPUT")
	}
</script>

<div class="absolute top-[690px] left-0 z-[4] w-full h-[90px] flex items-center justify-center gap-3">
	<Widget class="gap-5">
		<Group label={$text.controls.labels.execution}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={resetExecution} icon="reset" title={$text.controls.buttons.reset.title} />
				<ExecutionButton
					on:click={toggleExecution}
					icon={$isProgramExecuting ? "pause" : "play"}
					title={$isProgramExecuting
						? $text.controls.buttons.pause_program.title
						: $text.controls.buttons.play_program.title}
				/>
				<ExecutionButton
					on:click={fastProgram}
					icon="fast"
					title={$text.controls.buttons.fast_program.title}
				/>
			</div>
		</Group>
		<Group label={$text.controls.labels.instruction}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton
					on:click={playInstruction}
					icon="play"
					title={$text.controls.buttons.play_instruction.title}
				/>
				<ExecutionButton
					on:click={fastInstruction}
					icon="fast"
					title={$text.controls.buttons.fast_instruction.title}
				/>
			</div>
		</Group>
		<Group label={$text.controls.labels.step}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={playStep} icon="play" title={$text.controls.buttons.play_step.title} />
				<ExecutionButton on:click={skipStep} icon="fast" title={$text.controls.buttons.fast_step.title} />
			</div>
		</Group>
		<Group label={$text.controls.labels.speed}>
			<Slider
				bind:value={$animationSpeed}
				min={0.1}
				max={3}
				title={$text.controls.sliders.speed.title}
				on:change={speedChanged}
			/>
		</Group>
	</Widget>
	<Widget class="flex-col items-baseline justify-center text-gray-200">
		<Checkbox bind:checked={$displayAsBinary} on:click={binaryToggled}>
			{$text.controls.checkboxes.binary.text}
		</Checkbox>
		<ThreeStatesCheckbox
			value={$animationsEnabled ? ($minimalAnimations ? State.HALF : State.ON) : State.OFF}
			on:change={animationsToggled}
			descending={true}
		>
			{$text.controls.checkboxes.animations.text}
		</ThreeStatesCheckbox>
	</Widget>
	<StepText bind:this={$stepText} />
</div>
