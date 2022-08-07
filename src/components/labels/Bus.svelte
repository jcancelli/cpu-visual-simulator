<script lang="ts">
	import { displayBussesLabels, displayLabels } from "../../store/settings"
	import { WireTypes } from "../../wires/WireType"

	export let bus: keyof typeof BUSSES
	export let top = "auto"
	export let left = "auto"
	export let right = "auto"
	export let bottom = "auto"

	const BUSSES = {
		DATA: {
			text: "DATA BUS",
			color: WireTypes.DATA_EXT.color
		},
		ADDRESS: {
			text: "ADDRESS BUS",
			color: WireTypes.ADDRESS_EXT.color
		},
		CONTROL: {
			text: "CONTROL BUS",
			color: WireTypes.CONTROL_EXT.color
		}
	}
</script>

<div
	class="absolute w-fit font-bold cursor-default text-sm leading-tight"
	style="top: {top}; left: {left}; bottom: {bottom}; right: {right}; color: {BUSSES[bus].color}"
>
	{$displayLabels && $displayBussesLabels ? BUSSES[bus].text : ""}
</div>
