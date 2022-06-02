<script lang="ts">
	import execution, { isExecutingStore } from "../execution/execution"
	import animationStore from "../store/animationStore"
	import displaySettingsStore from "../store/displaySettingsStore"

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

	function toggleBinary() {
		displaySettingsStore.updateBinary(val => !val)
	}
</script>

<div class="control-bar">
	<div class="execution-buttons">
		<fieldset>
			<legend>Execution</legend>
			<button on:click={resetExecution} title="Reset" disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z"
					/>
				</svg>
			</button>
			<button on:click={toggleExecution} title={true ? "Play" : "Pause"}>
				{#if $isExecutingStore}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 0 24 24"
						width="24px"
						fill="#000000"
					>
						<path
							d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 0 24 24"
						width="24px"
						fill="#000000"
					>
						<path
							d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
						/>
					</svg>
				{/if}
			</button>
			<button on:click={skipToEnd} title="Skip to end" disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
					/>
				</svg>
			</button>
		</fieldset>
		<fieldset>
			<legend>Step</legend>
			<button on:click={playStep} title="Play step" disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
					/>
				</svg>
			</button>
			<button on:click={skipStep} title="Skip step" disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
					/>
				</svg>
			</button>
		</fieldset>
		<fieldset>
			<legend>Instruction</legend>
			<button on:click={playInstruction} disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"
					/>
				</svg>
			</button>
			<button on:click={skipInstruction} disabled>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#000000"
				>
					<path
						d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
					/>
				</svg>
			</button>
		</fieldset>
	</div>
	<div class="animation">
		<fieldset>
			<legend>Animation speed</legend>
			<input type="range" disabled />
		</fieldset>
		<fieldset>
			<legend>Animation</legend>
			<input type="checkbox" disabled />
		</fieldset>
	</div>
	<div class="display">
		<fieldset>
			<legend>Dispaly</legend>
			<button on:click={toggleBinary}>{$displaySettingsStore.binary ? "Symbolic" : "Binary"}</button
			>
		</fieldset>
	</div>
</div>

<style lang="scss">
	@import "../style/variables.scss";
	@import "../style/mixins.scss";

	.control-bar {
		position: relative;
		left: $ctrlbar-x;
		top: $ctrlbar-y;
		height: $ctrlbar-height;
		width: $ctrlbar-width;
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: 20px;
		background-color: darkgrey;
		padding: 13px 20px;
		box-shadow: $cpu-comp-shadow;
		box-sizing: border-box;
		border: 1px solid black;
		border-left: 0;
		border-radius: 0 20px 20px 0;
		z-index: 4;

		div {
			display: flex;
			align-items: center;
			justify-content: space-evenly;
			height: 100%;
		}
	}

	.execution-buttons {
		gap: 20px;

		button {
			@include center-content;
			width: 35px;
			height: 35px;
			outline: 0;
			border: 1px solid black;
			border-radius: 5px;
			background-color: white;
			cursor: pointer;

			&:active {
				filter: brightness(0.9);
			}

			&:disabled {
				filter: brightness(0.6);
				cursor: default;
			}

			svg {
				transform: scale(1.3);
			}
		}
	}

	.animation {
		gap: 10px;
	}

	fieldset {
		@include center-content;
		gap: 3px;
		height: 100%;
	}

	legend {
		color: white;
		text-align: center;
	}
</style>
