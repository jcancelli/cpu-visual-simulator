<script lang="ts">
	import displaySettingsStore from "../../store/displaySettingsStore"
	import { unsignedToBinary8bit } from "../../util/binaryUtil"
	import { flash as flashComponent } from "../../util/animationUtil"

	export let address: number

	let addressDiv: HTMLDivElement

	export function getAddress() {
		return address
	}

	export function flash() {
		return flashComponent(
			addressDiv,
			"background-color",
			{ r: 255, g: 140, b: 0 },
			{ r: 0, g: 255, b: 0 }
		)
	}
</script>

<div class="address" bind:this={addressDiv}>
	{$displaySettingsStore.binary ? unsignedToBinary8bit(address) : address}
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
