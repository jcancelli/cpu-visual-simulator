<script lang="ts">
	import type { Flashable, FlashableID, FlashAnimation } from "$lib/flash/animation"
	import { RegisterFlashAnimation } from "$lib/flash/register"
	import { Base, u8ToPaddedString, type U8 } from "$lib/types/integer"
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

	// Implements Flashable
	export function getFlashableID(): FlashableID {
		if (flashableId === undefined) {
			unreachable("Flashable ID not defined on Incrementer")
		}
		return flashableId
	}

	// Implements Flashable
	export function createFlashAnimation(): FlashAnimation {
		if (flashableId === undefined) {
			unreachable("Flashable ID not defined on Incrementer. Cannot create flash animation.")
		}
		return new RegisterFlashAnimation({
			flashableElementId: flashableId,
			element: htmlElement,
			properties: {
				background: true,
				text: true,
				border: true,
			},
		})
	}

	// Implements Flashable
	export function getFlashableSubelements(): Flashable[] {
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
