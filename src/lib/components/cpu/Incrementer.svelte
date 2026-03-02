<script lang="ts">
	import type { FlashableElement, FlashableID } from "$lib/state/flash_animations_playback.svelte"
	import { Base, u8ToPaddedString, type U8 } from "$lib/types/integer"
	import { makeFlashAnimation } from "$lib/util/animation"
	import { unreachable } from "$lib/util/development"

	export interface IncrementerProps {
		/** Base used for the string representation of the +2 */
		base?: Base
		id?: string
		flashableId?: FlashableID
		class?: string
	}

	let { base = Base.DECIMAL, id, flashableId, ...props }: IncrementerProps = $props()

	/** Handle to the html element that represents this component */
	let htmlElement: HTMLElement

	// Implements FlashableElement
	export function getFlashableID(): FlashableID {
		if (flashableId !== undefined) {
			return flashableId
		}
		unreachable("Flashable ID not defined on Incrementer")
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
		return []
	}
</script>

<div
	bind:this={htmlElement}
	{id}
	class="
		incrementer
		register
		register-foreground
		register-background
		register-border
		w-(--byte-register-width)
		rounded-md
		text-center
		shadow-register
		{props.class ?? ''}
	"
>
	+{u8ToPaddedString(2 as U8, base)}
</div>
