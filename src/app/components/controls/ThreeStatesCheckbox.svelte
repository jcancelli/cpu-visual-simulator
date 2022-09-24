<script lang="ts" context="module">
	export enum State {
		OFF = "OFF",
		HALF = "HALF",
		ON = "ON"
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from "svelte"

	export let disabled = false
	export let value: State = State.OFF
	export let descending = false

	const dispatch = createEventDispatcher()

	function handleClick(e) {
		switch (value) {
			case State.OFF:
				value = descending ? State.ON : State.HALF
				break
			case State.HALF:
				value = descending ? State.OFF : State.ON
				break
			case State.ON:
				value = descending ? State.HALF : State.OFF
				break
		}
		dispatch("click", e)
		dispatch("change", {
			value: value
		})
	}
</script>

<div
	class="       
        flex
        items-center
        justify-center
        gap-1
		select-none
        {disabled ? 'cursor-default' : 'cursor-pointer'}
        {$$restProps.class}
    "
	on:click={handleClick}
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<div
		class="
            w-4
            h-4
			flex
			items-center
			justify-center
            border
            border-black
            rounded-md
            transition-colors
            {value === State.ON ? 'bg-[#0F0]' : ''}
            {disabled ? 'brightness-[.6]' : ''}
        "
	>
		{#if value === State.HALF}
			<div
				class="
					w-[98%]
					h-[35%]
					rounded-md
					bg-lime-400
					{disabled ? 'brightness-[.6]' : ''}
				"
			/>
		{/if}
	</div>
	<div class="font-medium pb-[3px]"><slot /></div>
</div>
