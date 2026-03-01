<script lang="ts">
	import type { StatusWordRegister } from "$lib/register/status_word"

	export interface StatusWordProps {
		statusWord: StatusWordRegister
		disabled?: boolean
		id?: string
		class?: string
	}

	let { statusWord, disabled, id, ...props }: StatusWordProps = $props()
</script>

<!-- TODO: Add aria labels for flags -->
<div
	{id}
	class="
		register
		register-border
		register-foreground
		register-background
		flex
		w-(--byte-register-width)
		flex-row
		flex-nowrap
		rounded-md
		shadow-register
		contain-paint
		{props.class ?? ''}
	"
>
	<button
		class="
			register
			register-foreground
			register-background
			block
			border-r
			border-s-register-border-light
			px-1.25
			text-center
			not-disabled:cursor-pointer
			dark:border-r-register-border-dark
		"
		onclick={() => (statusWord.zeroFlag = !statusWord.zeroFlag)}
		{disabled}
	>
		{statusWord.zeroFlag ? "1" : "0"}
	</button>
	<button
		class="
			register
			register-foreground
			register-background
			block
			border-r
			border-s-register-border-light
			px-1.25
			text-center
			not-disabled:cursor-pointer
			dark:border-r-register-border-dark
		"
		onclick={() => (statusWord.negativeFlag = !statusWord.negativeFlag)}
		{disabled}
	>
		{statusWord.negativeFlag ? "1" : "0"}
	</button>
	<p class="register register-foreground block w-full text-center">----</p>
</div>
