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
	import logger, { LogCategory } from "../../util/logger"
	import ProgramExecution, { ExecutionCallback } from "../../execution/ProgramExecution"
	import ThreeStatesCheckbox, { State as AnimationsState } from "./ThreeStatesCheckbox.svelte"
	import Cpu from "../../model/Cpu"

	export let cpu: Cpu
	export let programExecution: ProgramExecution

	const isProgramExecuting = programExecution.isExecuting

	function resetExecution() {
		logger.debug(`Reset pressed`, LogCategory.USER_INPUT)
		programExecution.reset()
		cpu.reset()
	}

	function toggleExecution() {
		logger.debug(`Toggle execution pressed`, LogCategory.USER_INPUT)
		programExecution.toggle()
	}

	function fastProgram() {
		logger.debug(`Skip execution pressed`, LogCategory.USER_INPUT)
		let currentAnimationsState: AnimationsState
		if ($minimalAnimations && $animationsEnabled) {
			currentAnimationsState = AnimationsState.HALF
		} else if (!$minimalAnimations && !$animationsEnabled) {
			currentAnimationsState = AnimationsState.OFF
		} else {
			currentAnimationsState = AnimationsState.ON
		}
		const resetAnimationsStateCallback: ExecutionCallback = ctx => {
			toggleAnimations(currentAnimationsState)
		}
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.start(resetAnimationsStateCallback)
	}

	function playStep() {
		logger.debug(`Play step pressed`, LogCategory.USER_INPUT)
		programExecution.step()
	}

	function fastStep() {
		logger.debug(`Skip step pressed`, LogCategory.USER_INPUT)
		let currentAnimationsState: AnimationsState
		if ($minimalAnimations && $animationsEnabled) {
			currentAnimationsState = AnimationsState.HALF
		} else if (!$minimalAnimations && !$animationsEnabled) {
			currentAnimationsState = AnimationsState.OFF
		} else {
			currentAnimationsState = AnimationsState.ON
		}
		const resetAnimationsStateCallback: ExecutionCallback = ctx => {
			toggleAnimations(currentAnimationsState)
		}
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.step(resetAnimationsStateCallback)
	}

	function playInstruction() {
		logger.debug(`Play instruction pressed`, LogCategory.USER_INPUT)
		programExecution.instruction()
	}

	function fastInstruction() {
		logger.debug(`Skip instruction pressed`, LogCategory.USER_INPUT)
		let currentAnimationsState: AnimationsState
		if ($minimalAnimations && $animationsEnabled) {
			currentAnimationsState = AnimationsState.HALF
		} else if (!$minimalAnimations && !$animationsEnabled) {
			currentAnimationsState = AnimationsState.OFF
		} else {
			currentAnimationsState = AnimationsState.ON
		}
		const resetAnimationsStateCallback: ExecutionCallback = ctx => {
			toggleAnimations(currentAnimationsState)
		}
		$animationsEnabled = false
		$minimalAnimations = false
		programExecution.instruction(resetAnimationsStateCallback)
	}

	function speedChanged() {
		logger.debug(`Speed slider moved - ${$animationSpeed}`, LogCategory.USER_INPUT)
	}

	function binaryToggled() {
		logger.debug(`Binary toggle pressed - ${$displayAsBinary}`, LogCategory.USER_INPUT)
	}

	function onAnimationsToggled(event: CustomEvent) {
		toggleAnimations(event.detail.value)
		logger.debug(`Animations toggle pressed - ${event.detail.value}`, LogCategory.USER_INPUT)
	}

	function toggleAnimations(state: AnimationsState): void {
		switch (state) {
			case AnimationsState.OFF:
				$minimalAnimations = false
				$animationsEnabled = false
				break
			case AnimationsState.HALF:
				$minimalAnimations = true
				$animationsEnabled = true
				break
			case AnimationsState.ON:
				$minimalAnimations = false
				$animationsEnabled = true
				break
		}
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
				<ExecutionButton on:click={fastStep} icon="fast" title={$text.controls.buttons.fast_step.title} />
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
			value={$animationsEnabled
				? $minimalAnimations
					? AnimationsState.HALF
					: AnimationsState.ON
				: AnimationsState.OFF}
			on:change={onAnimationsToggled}
			descending={true}
		>
			{$text.controls.checkboxes.animations.text}
		</ThreeStatesCheckbox>
	</Widget>
	<StepText bind:this={$stepText} />
</div>
