<script lang="ts">
	import { displayAsBinary } from "../../store/settings"
	import { flash as flashComponent } from "../../util/animationUtil"
	import BinaryValue from "../../util/BinaryValue"

	export let address: number

	let addressDiv: HTMLDivElement

	export function getAddress() {
		return address
	}

	export async function flash() {
		return flashComponent(
			addressDiv,
			"background-color",
			{ r: 255, g: 140, b: 0 },
			{ r: 0, g: 255, b: 0 }
		)
	}
</script>

<div
	class="
		h-[30px]
		w-[100px]
		flex
		items-center
		justify-center
		bg-[#FF8C00]
		border
		border-black
		border-t-0
		{$$restProps.class}
	"
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
