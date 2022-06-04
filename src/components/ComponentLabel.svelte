<script lang="ts" context="module">
	export type FontSize = "SMALL" | "MEDIUM" | "LARGE"
</script>

<script lang="ts">
	import displaySettingsStore from "../store/displaySettingsStore"

	export let text = ""
	export let top = "auto"
	export let left = "auto"
	export let right = "auto"
	export let bottom = "auto"
	export let fontSize: FontSize = "MEDIUM"

	const FONT_SIZES = {
		SMALL: "12px",
		MEDIUM: "16px",
		LARGE: "24px"
	}
</script>

<div
	class="label"
	style="top: {top}; left: {left}; bottom: {bottom}; right: {right}; font-size: {FONT_SIZES[
		fontSize
	]}"
>
	{$displaySettingsStore.showLabels ? text : ""}
</div>

<style lang="scss">
	@import "../style/variables.scss";

	.label {
		width: fit-content;
		font-weight: bold;
		position: absolute;
		cursor: default;
	}
</style>
