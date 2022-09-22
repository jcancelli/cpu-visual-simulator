<script lang="ts">
	import Widget from "./Widget.svelte"
	import ExecutionButton from "./ExecutionButton.svelte"
	import { minimalAnimations, displayAsBinary, animationSpeed } from "../../store/settings"
	import Checkbox from "./Checkbox.svelte"
	import Slider from "../../../shared/components/slider/Control.svelte"
	import Group from "./Group.svelte"
	import text from "../../store/text"
	import { cpuStore } from "../../store/state"
	import StepText from "./StepText.svelte"
	import { stepText } from "../../store/components"
	import Logger from "../../util/logger"
	import ProgramExecution from "../../execution/ProgramExecution"

	export let programExecution: ProgramExecution

	const isProgramExecuting = programExecution.isExecuting

	function resetExecution() {
		Logger.info(`Reset pressed`, "USER_INPUT")
		programExecution.reset()
		$cpuStore.reset()
	}

	function toggleExecution() {
		Logger.info(`Toggle execution pressed`, "USER_INPUT")
		programExecution.toggle()
	}

	function skipToEnd() {
		Logger.info(`Skip execution pressed`, "USER_INPUT")
	}

	function playStep() {
		Logger.info(`Play step pressed`, "USER_INPUT")
		programExecution.step()
	}

	function skipStep() {
		Logger.info(`Skip step pressed`, "USER_INPUT")
	}

	function playInstruction() {
		Logger.info(`Play instruction pressed`, "USER_INPUT")
		programExecution.instruction()
	}

	function skipInstruction() {
		Logger.info(`Skip instruction pressed`, "USER_INPUT")
	}

	function speedChanged() {
		Logger.info(`Speed slider moved - ${$animationSpeed}`, "USER_INPUT")
	}

	function binaryToggled() {
		Logger.info(`Binary toggle pressed - ${$displayAsBinary}`, "USER_INPUT")
	}

	function animationsToggled() {
		$minimalAnimations = !$minimalAnimations
		Logger.info(`Animations toggle pressed - ${$minimalAnimations}`, "USER_INPUT")
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
					title={$isProgramExecuting ? $text.controls.buttons.pause.title : $text.controls.buttons.play.title}
				/>
				<ExecutionButton on:click={skipToEnd} icon="skip" title={$text.controls.buttons.end.title} disabled />
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
					on:click={skipInstruction}
					icon="skip"
					title={$text.controls.buttons.skip_instruction.title}
					disabled
				/>
			</div>
		</Group>
		<Group label={$text.controls.labels.step}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={playStep} icon="play" title={$text.controls.buttons.play_step.title} />
				<ExecutionButton
					on:click={skipStep}
					icon="skip"
					title={$text.controls.buttons.skip_step.title}
					disabled
				/>
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
		<Checkbox bind:checked={$displayAsBinary} on:click={binaryToggled}
			>{$text.controls.checkboxes.binary.text}</Checkbox
		>
		<Checkbox checked={!$minimalAnimations} on:click={animationsToggled}
			>{$text.controls.checkboxes.animations.text}</Checkbox
		>
	</Widget>
	<StepText bind:this={$stepText} />
</div>
