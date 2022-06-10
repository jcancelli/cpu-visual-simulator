<script lang="ts" context="module">
	import { slide } from "svelte/transition"

	export type MessageType = "ERROR" | "WARNING" | "SUCCESS" | "INFO"

	type Message = {
		id: number
		type: MessageType
		message: string
	}
</script>

<script lang="ts">
	const MAX_MESSAGES = 3
	let messages: Message[] = []

	export function message(type: MessageType, message: string) {
		if (messages.length === MAX_MESSAGES) {
			messages.shift()
		}
		messages = [
			...messages,
			{
				id: Math.random(),
				type,
				message
			}
		]
	}

	function removeMessage(id: number) {
		messages = messages.filter(m => m.id !== id)
	}
</script>

<div class="fixed top-0 left-0 w-screen h-fit flex flex-col">
	{#each messages as message (message.id)}
		<div
			class="relative w-full h-fit flex justify-center items-center p-5 origin-left border text-white {message.type}"
			transition:slide
		>
			<button
				class="absolute bg-transparent text-white cursor-pointer font-bold right-8"
				on:click={() => removeMessage(message.id)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 0 24 24"
					width="24px"
					fill="#FFFFFF"
					class="hover:scale-105"
				>
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
					/>
				</svg>
			</button>
			<p class="w-3/4 text-center text-xl">{message.message}</p>
		</div>
	{/each}
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
