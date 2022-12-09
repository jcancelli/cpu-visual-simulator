<script lang="ts">
	import MessageComponent from "./Message.svelte"
	import { messageFeedStore } from "../../store/state"

	$: messages = $messageFeedStore.messages

	const MAX_MESSAGES = 3
</script>

<div class="fixed top-0 left-0 w-screen h-fit flex flex-col">
	{#each $messages as message (message.id)}
		<MessageComponent {message} on:closemessage={() => $messageFeedStore.deleteMessage(message.id)} />
	{/each}
</div>
