<script lang="ts">
	import type { Flashable, FlashableID, FlashAnimation } from "$lib/flash/animation"
	import { RegisterFlashAnimation, StatusWordFlashAnimation } from "$lib/flash/register"
	import type { StatusWordRegister } from "$lib/register/status_word"
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
	let unusedBitsElement: HTMLElement

	// Implements FlashableElement
	export function getFlashableID(): FlashableID {
		if (flashableIds === undefined) {
			unreachable("Flashable ID not defined on StatusWord")
		}
		return flashableIds.statusWord
	}

	// Implements FlashableElement
	export function createFlashAnimation(): FlashAnimation {
		if (flashableIds === undefined) {
			unreachable("Flashable ID not defined on StatusWord. Cannot create flash animation.")
		}
		return new StatusWordFlashAnimation({
			flashableElementId: flashableIds.statusWord,
			statusWordElement: htmlElement,
			zeroFlagElement,
			negativeFlagElement,
			unusedBitsElement,
		})
	}

	// Implements FlashableElement
	export function getFlashableSubelements(): Flashable[] {
		if (flashableIds === undefined) {
			unreachable(
				"Flashable ID not defined on StatusWord. Unable to get flashable subcomponents.",
			)
		}
		return [
			{
				getFlashableID: () => flashableIds.zeroFlag,
				createFlashAnimation: () => {
					return new RegisterFlashAnimation({
						flashableElementId: flashableIds.zeroFlag,
						element: zeroFlagElement,
						properties: {
							background: true,
							text: true,
							border: true,
						},
					})
				},
				getFlashableSubelements: () => [],
			},
			{
				getFlashableID: () => flashableIds.negativeFlag,
				createFlashAnimation: () => {
					return new RegisterFlashAnimation({
						flashableElementId: flashableIds.negativeFlag,
						element: negativeFlagElement,
						properties: {
							background: true,
							text: true,
							border: true,
						},
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
	<p bind:this={unusedBitsElement} class="register register-foreground block w-full text-center">
		----
	</p>
</div>
