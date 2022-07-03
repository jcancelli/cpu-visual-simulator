<script lang="ts">
	import Message, { Message as MessageType } from "./Message.svelte"

	const MAX_MESSAGES = 3
	let messages: MessageType[] = []

	export function error(message: string) {
		addMessage({
			id: Math.random(),
			type: "ERROR",
			message,
			timer: true
		})
	}

	export function warning(message: string) {
		addMessage({
			id: Math.random(),
			type: "WARNING",
			message,
			timer: true
		})
	}

	export function success(message: string) {
		addMessage({
			id: Math.random(),
			type: "SUCCESS",
			message,
			timer: true
		})
	}

	export function info(message: string) {
		addMessage({
			id: Math.random(),
			type: "INFO",
			message,
			timer: true
		})
	}

	export function bug(message: string) {
		addMessage({
			id: Math.random(),
			type: "BUG",
			message,
			timer: false
		})
	}

	function addMessage(message: MessageType) {
		if (messages.length === MAX_MESSAGES) {
			messages.shift()
		}
		messages = [...messages, message]
	}

	function removeMessage(event: CustomEvent) {
		messages = messages.filter(m => m.id !== event.detail.messageId)
	}
</script>

<div class="fixed top-0 left-0 w-screen h-fit flex flex-col">
	{#each messages as message (message.id)}
		<Message {message} on:closemessage={removeMessage} />
	{/each}
</div>
