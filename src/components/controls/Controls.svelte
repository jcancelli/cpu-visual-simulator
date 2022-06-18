<script lang="ts">
	import Widget from "./Widget.svelte"
	import ExecutionButton from "../basic/buttons/Execution.svelte"
	import execution from "../../execution/execution"
	import { isExecutingStore } from "../../execution/execution"
	import { animationSpeed } from "../../store/settings"
	import { playAnimations, displayAsBinary } from "../../store/settings"
	import Checkbox from "../basic/checkboxes/Control.svelte"
	import Slider from "../basic/slider/Control.svelte"

	function resetExecution() {
		execution.reset()
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
	<Widget>
		<div class="flex items-center justify-center gap-5">
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={resetExecution} icon="reset" title="Reset" disabled />
				<ExecutionButton
					on:click={toggleExecution}
					icon={$isExecutingStore ? "pause" : "play"}
					title={$isExecutingStore ? "Pause" : "Play"}
				/>
				<ExecutionButton on:click={skipToEnd} icon="skip" title="Skip to end" disabled />
			</div>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={playStep} icon="play" title="Play step" disabled />
				<ExecutionButton on:click={skipStep} icon="skip" title="Skip step" disabled />
			</div>
			<div class="flex items-center justify-center gap-1">
				<ExecutionButton on:click={playInstruction} icon="play" title="Play instruction" />
				<ExecutionButton on:click={skipInstruction} icon="skip" title="Skip instruction" disabled />
			</div>
		</div>
	</Widget>
	<Widget>
		<div class="flex flex-col items-center justify-center font-medium">
			SPEED
			<Slider bind:value={$animationSpeed} min={0.1} max={3} />
		</div>
		<Checkbox bind:checked={$playAnimations}>ANIMATE</Checkbox>
		<Checkbox bind:checked={$displayAsBinary}>BINARY</Checkbox>
	</Widget>
</div>
