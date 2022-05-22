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

	function scaleX(node, { delay = 0, duration = 200 }) {
		return {
			delay,
			duration,
			css: t => `transform: scaleX(${t})`
		}
	}
</script>

<div class="feed">
	{#each messages as message (message.id)}
		<div class="message {message.type}" transition:slide>
			<button class="close-message" on:click={() => removeMessage(message.id)}>
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
			<p>{message.message}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	$padding: 20px;

	.feed {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: fit-content;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		box-sizing: border-box;
	}

	.message {
		width: 100%;
		height: fit-content;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: $padding;
		color: white;
		background-color: grey;
		transform-origin: left;
		border-style: solid;
		box-sizing: border-box;

		&.ERROR {
			background-color: firebrick;
			border-color: darkred;
		}

		&.WARNING {
			background-color: orange;
			border-color: #d17402;
		}

		&.SUCCESS {
			background-color: green;
			border-color: #006400;
		}

		&.INFO {
			background-color: dodgerblue;
			border-color: #1359a0;
		}
	}

	:global(.feed .message:not(:last-child)) {
		border-bottom-width: 1px;
	}

	p {
		width: 75%;
		font-size: 1.2rem;
		text-align: center;
	}

	.close-message {
		position: absolute;
		right: $padding * 1.5;
		background-color: transparent;
		outline: 0;
		border: 0;
		color: white;
		cursor: pointer;
		font-weight: bold;

		svg:hover {
			transform: scale(105%);
		}
	}
</style>
