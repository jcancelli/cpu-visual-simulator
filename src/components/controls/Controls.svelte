<script lang="ts">
	import Widget from "./Widget.svelte"
	import ExecutionButton from "../basic/buttons/Execution.svelte"
	import execution, { isExecuting } from "../../execution/execution"
	import { playAnimations, displayAsBinary, animationSpeed } from "../../store/settings"
	import Checkbox from "../basic/checkboxes/Control.svelte"
	import Slider from "../basic/slider/Control.svelte"
	import Group from "./Group.svelte"
	import lang from "../../store/lang"
	import cpu from "../../store/cpu"

	function resetExecution() {
		execution.reset()
		cpu.reset()
	}

	function toggleExecution() {
		execution.toggle()
	}

	function skipToEnd() {}

	function playStep() {
		execution.step()
	}

	function skipStep() {}

	function playInstruction() {
		execution.instruction()
	}

	function skipInstruction() {}
</script>

<div
	class="absolute top-[690px] left-0 z-[4] w-full h-[90px] flex items-center justify-center gap-3"
>
	<Widget class="gap-5">
		<Group label={$lang.controls.labels.execution}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton
					on:click={resetExecution}
					icon="reset"
					title={$lang.controls.buttons.reset.title}
				/>
				<ExecutionButton
					on:click={toggleExecution}
					icon={$isExecuting ? "pause" : "play"}
					title={$isExecuting
						? $lang.controls.buttons.pause.title
						: $lang.controls.buttons.play.title}
				/>
				<ExecutionButton
					on:click={skipToEnd}
					icon="skip"
					title={$lang.controls.buttons.end.title}
					disabled
				/>
			</div>
		</Group>
		<Group label={$lang.controls.labels.step}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton
					on:click={playStep}
					icon="play"
					title={$lang.controls.buttons.play_step.title}
				/>
				<ExecutionButton
					on:click={skipStep}
					icon="skip"
					title={$lang.controls.buttons.skip_step.title}
					disabled
				/>
			</div>
		</Group>
		<Group label={$lang.controls.labels.instruction}>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton
					on:click={playInstruction}
					icon="play"
					title={$lang.controls.buttons.play_instruction.title}
				/>
				<ExecutionButton
					on:click={skipInstruction}
					icon="skip"
					title={$lang.controls.buttons.skip_instruction.title}
					disabled
				/>
			</div>
		</Group>
		<Group label={$lang.controls.labels.speed}>
			<Slider
				bind:value={$animationSpeed}
				min={0.1}
				max={3}
				title={$lang.controls.sliders.speed.title}
			/>
		</Group>
	</Widget>
	<Widget class="flex-col items-baseline justify-center text-gray-200">
		<Checkbox bind:checked={$displayAsBinary}>{$lang.controls.checkboxes.binary.text}</Checkbox>
		<Checkbox bind:checked={$playAnimations}>{$lang.controls.checkboxes.animations.text}</Checkbox>
	</Widget>
</div>
