<script lang="ts">
	import { animationsEnabled, extAddressBusAnimationColor, extAddressBusColor } from "../../store/settings"

	import { displayAsBinary } from "../../store/settings"
	import { flash as flashComponent } from "../../util/animation"
	import BinaryValue from "../../model/BinaryValue"
	import { Color } from "../../util/colors"

	export let address: number

	let addressDiv: HTMLDivElement

	export function getAddress() {
		return address
	}

	export async function flash() {
		if (!$animationsEnabled) return
		return flashComponent(addressDiv, "background-color", Color.fromString($extAddressBusAnimationColor))
	}
</script>

<div
	class="
		h-[30px]
		w-[100px]
		flex
		items-center
		justify-center
		border
		border-black
		border-t-0
		font-mono
		{$$restProps.class}
	"
	style:background-color={$extAddressBusColor}
	bind:this={addressDiv}
>
	{$displayAsBinary ? new BinaryValue(8, address).toBinaryString() : address}
</div>

<style lang="scss">
	.first-address {
		border-radius: 16px 0 0 0;
		border-top-width: 1px;
	}

	.last-address {
		border-radius: 0 0 0 16px;
	}
</style>
