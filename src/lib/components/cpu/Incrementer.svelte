<script lang="ts">
	import { Base, u8ToPaddedString, type U8 } from "$lib/types/integer"

	export interface IncrementerProps {
		/** Base used for the string representation of the +2 */
		base?: Base
		id?: string
		class?: string
	}

	let { base = Base.DECIMAL, id, ...props }: IncrementerProps = $props()
</script>

<div
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
		{props.class ?? ''}
	"
>
	+{u8ToPaddedString(2 as U8, base)}
</div>
