<script lang="ts">
	import { displayLabels } from "../../store/settings"

	export let text = ""
	export let top = "auto"
	export let left = "auto"
	export let right = "auto"
	export let bottom = "auto"
	export let fontSize: keyof typeof FONT_SIZES = "MEDIUM"

	const FONT_SIZES = {
		SMALL: "text-xs",
		MEDIUM: "text-base",
		LARGE: "text-2xl"
	}
</script>

<div
	class="absolute w-fit font-bold cursor-default {FONT_SIZES[fontSize]} leading-tight"
	style:top
	style:bottom
	style:left
	style:right
>
	{$displayLabels ? text : ""}
</div>
