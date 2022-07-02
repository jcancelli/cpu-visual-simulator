<script lang="ts" context="module">
	export type Message = {
		id: number
		type: "ERROR" | "WARNING" | "SUCCESS" | "INFO"
		message: string
	}
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import { slide } from "svelte/transition"
	import Progress from "../basic/progress/Message.svelte"

	const dispach = createEventDispatcher()

	export let message: Message

	const MESSAGE_DURATION_SECONDS = 5
	let secondsBeforeClose = MESSAGE_DURATION_SECONDS
	let isTimerPaused = false

	onMount(() => {
		const interval = setInterval(() => {
			if (!isTimerPaused) {
				secondsBeforeClose--
			}
			if (secondsBeforeClose === 0) {
				clearInterval(interval)
				closeMessage()
			}
		}, 1000)
	})

	function closeMessage() {
		dispach("closemessage", { messageId: message.id })
	}

	function pauseTimer() {
		secondsBeforeClose = MESSAGE_DURATION_SECONDS
		isTimerPaused = true
	}

	function resumeTimer() {
		isTimerPaused = false
	}
</script>

<div
	class="relative w-full h-fit flex justify-center items-center p-5 origin-left text-white {message.type}"
	transition:slide
	on:mouseenter={pauseTimer}
	on:mouseleave={resumeTimer}
>
	<button
		class="absolute bg-transparent text-white cursor-pointer font-bold right-8"
		on:click={closeMessage}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="#FFFFFF"
			class="h-6 w-6 hover:scale-105"
		>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path
				d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
			/>
		</svg>
	</button>
	<p class="w-3/4 text-center text-xl">{message.message}</p>
	<Progress
		class="absolute left-0 bottom-0"
		value={secondsBeforeClose}
		max={MESSAGE_DURATION_SECONDS}
	/>
</div>

<style lang="scss">
	.ERROR {
		background-color: firebrick;
		border-color: darkred;
	}

	.WARNING {
		background-color: orange;
		border-color: #d17402;
	}

	.SUCCESS {
		background-color: green;
		border-color: #006400;
	}

	.INFO {
		background-color: dodgerblue;
		border-color: #1359a0;
	}
</style>
