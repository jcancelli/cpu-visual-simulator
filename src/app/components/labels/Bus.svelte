<script lang="ts">
	import { externalAddressBusColor, externalControlBusColor, externalDataBusColor } from "../../store/busses"
	import { displayBussesLabels } from "../../store/settings"

	export let bus: keyof typeof BUSSES
	export let top = "auto"
	export let left = "auto"
	export let right = "auto"
	export let bottom = "auto"

	const BUSSES = {
		DATA: {
			text: "DATA BUS",
			colorStore: externalDataBusColor
		},
		ADDRESS: {
			text: "ADDRESS BUS",
			colorStore: externalAddressBusColor
		},
		CONTROL: {
			text: "CONTROL BUS",
			colorStore: externalControlBusColor
		}
	}

	$: color = BUSSES[bus].colorStore
</script>

<div
	class="absolute w-fit font-bold cursor-default text-sm leading-tight"
	style:top
	style:bottom
	style:left
	style:right
	style:color={$color}
>
	{$displayBussesLabels ? BUSSES[bus].text : ""}
</div>
