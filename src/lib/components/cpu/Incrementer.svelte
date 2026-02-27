<script lang="ts">
	import { Base, u8ToPaddedString, type U8 } from "$lib/types/integer"

	export interface IncrementeProps {
		/** ID of this element */
		id?: string
		/** Base used for the string representation of the +2 */
		base?: Base
	}

	let { id, base = Base.DECIMAL }: IncrementeProps = $props()
</script>

<div
	{id}
	autocapitalize="characters"
	class="
		relative
		h-7.5
		w-25
		rounded-md
		border
		border-black
		bg-gray-100
		text-center
		font-mono
		text-base
		leading-7.5
	"
>
	+{u8ToPaddedString(2 as U8, base)}
</div>
