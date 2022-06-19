<script lang="ts">
	export let min = 0
	export let max = 1
	export let value = max / 2 + min
	export let step = 0.1
	export let disabled = false
	export let title = ""
</script>

<input
	type="range"
	class={$$restProps.class}
	{min}
	{max}
	{step}
	{disabled}
	{title}
	bind:value
	on:input
	on:change
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
/>

<style>
	/* https://www.cssportal.com/style-input-range/ */
	input[type="range"] {
		-webkit-appearance: none;
		width: 100%;
		background-color: transparent;
		height: 26px;
		margin: 0;
	}
	input[type="range"]:focus {
		outline: none;
	}
	input[type="range"]::-webkit-slider-runnable-track {
		width: 100%;
		height: 4px;
		cursor: pointer;
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
		background: #606060;
		border-radius: 5px;
		border: 1px solid #000000;
	}
	input[type="range"]::-webkit-slider-thumb {
		box-shadow: 0px 0px 3px #000000;
		border: 0px solid #000000;
		height: 20px;
		width: 8px;
		border-radius: 4px;
		background: #eceff1;
		cursor: pointer;
		-webkit-appearance: none;
		margin-top: -8px;
	}
	input[type="range"]:focus::-webkit-slider-runnable-track {
		background: #606060;
	}
	input[type="range"]::-moz-range-track {
		width: 100%;
		height: 4px;
		cursor: pointer;
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
		background: #606060;
		border-radius: 5px;
		border: 1px solid #000000;
	}
	input[type="range"]::-moz-range-thumb {
		box-shadow: 0px 0px 3px #000000;
		border: 0px solid #000000;
		height: 20px;
		width: 8px;
		border-radius: 4px;
		background: #eceff1;
		cursor: pointer;
	}
	input[type="range"]::-ms-track {
		width: 100%;
		height: 4px;
		cursor: pointer;
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
	input[type="range"]::-ms-fill-lower {
		background: #606060;
		border: 1px solid #000000;
		border-radius: 10px;
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
	}
	input[type="range"]::-ms-fill-upper {
		background: #606060;
		border: 1px solid #000000;
		border-radius: 10px;
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
	}
	input[type="range"]::-ms-thumb {
		margin-top: 1px;
		box-shadow: 0px 0px 3px #000000;
		border: 0px solid #000000;
		height: 20px;
		width: 8px;
		border-radius: 4px;
		background: #eceff1;
		cursor: pointer;
	}
	input[type="range"]:focus::-ms-fill-lower {
		background: #606060;
	}
	input[type="range"]:focus::-ms-fill-upper {
		background: #606060;
	}
</style>
