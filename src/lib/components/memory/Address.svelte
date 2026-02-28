<script lang="ts">
	import { Base, u8ToPaddedString, type U8 } from "$lib/types/integer"

	export interface AddressProps {
		address: U8
		base?: Base
		id?: string
		class?: string
	}

	let { address, base, id, ...props }: AddressProps = $props()
</script>

<div
	{id}
	class="
		memory-address
		register
		w-(--memory-address-width)
		bg-memory-address
		text-center
		text-address-text
		{props.class ?? ''}
	"
>
	{u8ToPaddedString(address, base)}
</div>
