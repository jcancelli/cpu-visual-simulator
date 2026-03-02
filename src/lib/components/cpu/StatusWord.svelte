<script lang="ts">
	import type { StatusWordRegister } from "$lib/register/status_word"
	import type { FlashableElement, FlashableID } from "$lib/state/flash_animations_playback.svelte"
	import { makeFlashAnimation } from "$lib/util/animation"
	import { unreachable } from "$lib/util/development"

	export interface StatusWordProps {
		statusWord: StatusWordRegister
		disabled?: boolean
		id?: string
		flashableIds?: {
			statusWord: FlashableID
			zeroFlag: FlashableID
			negativeFlag: FlashableID
		}
		class?: string
	}

	let { statusWord, disabled, id, flashableIds, ...props }: StatusWordProps = $props()

	let htmlElement: HTMLElement
	let zeroFlagElement: HTMLElement
	let negativeFlagElement: HTMLElement

	// Implements FlashableElement
	export function getFlashableID(): FlashableID {
		if (flashableIds !== undefined) {
			return flashableIds.statusWord
		}
		unreachable("Flashable ID not defined on StatusWord")
	}

	// Implements FlashableElement
	export function createFlashAnimation(): Animation {
		return makeFlashAnimation(htmlElement, {
			background: true,
			text: true,
			border: true,
		})
	}

	// Implements FlashableElement
	export function getFlashableSubelements(): FlashableElement[] {
		if (flashableIds === undefined) {
			unreachable(
				"Flashable ID not defined on StatusWord. Unable to get flashable subcomponents.",
			)
		}
		return [
			{
				getFlashableID: () => flashableIds.zeroFlag,
				createFlashAnimation: () => {
					return makeFlashAnimation(zeroFlagElement, {
						background: true,
						text: true,
					})
				},
				getFlashableSubelements: () => [],
			},
			{
				getFlashableID: () => flashableIds.negativeFlag,
				createFlashAnimation: () => {
					return makeFlashAnimation(negativeFlagElement, {
						background: true,
						text: true,
					})
				},
				getFlashableSubelements: () => [],
			},
		]
	}
</script>

<!-- TODO: Add aria labels for flags -->
<div
	bind:this={htmlElement}
	{id}
	class="
		status-word
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
		bind:this={zeroFlagElement}
		class="
			status-word-zero-flag
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
		bind:this={negativeFlagElement}
		class="
			status-word-negative-flag
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
