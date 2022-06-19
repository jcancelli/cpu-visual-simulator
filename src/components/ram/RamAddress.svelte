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

<div class="address" bind:this={addressDiv}>
	{$displayAsBinary ? new BinaryValue(8, address).toBinaryString() : address}
</div>

<style lang="scss">
	@import "../../style/variables.scss";

	.address {
		height: $ram-cell-height;
		width: $ram-address-width;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: darkorange;
		border: thin solid black;
		border-top: 0;
	}

	:global(.row:first-child .address) {
		border-radius: 10px 0 0 0;
		border-top: thin solid black;
	}

	:global(.row:last-child .address) {
		border-radius: 0 0 0 10px;
	}
</style>
