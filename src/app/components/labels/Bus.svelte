<script lang="ts">
	import { extAddressBusColor, extControlBusColor, extDataBusColor } from "../../store/settings"
	import { displayBussesLabels } from "../../store/settings"

	export let bus: keyof typeof BUSSES
	export let top = "auto"
	export let left = "auto"
	export let right = "auto"
	export let bottom = "auto"

	const BUSSES = {
		DATA: {
			text: "DATA BUS",
			colorStore: extDataBusColor
		},
		ADDRESS: {
			text: "ADDRESS BUS",
			colorStore: extAddressBusColor
		},
		CONTROL: {
			text: "CONTROL BUS",
			colorStore: extControlBusColor
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
