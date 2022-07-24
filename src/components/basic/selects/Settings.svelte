<script lang="ts">
	export let value = ""
	export let placeholder = ""
	export let disabled = false
	export let options: string[] = []
</script>

<select
	class="
        cursor-pointer
        bg-transparent
        border-2
        border-black
        text-black
        rounded-md
        px-1
        disabled:brightness-[.6]
        w-fit
        {$$restProps.class}
    "
	on:input
	on:change
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	bind:value
	{disabled}
>
	{#if placeholder !== ""}
		<option class="text-black bg-white" value="" selected disabled>{placeholder}</option>
	{/if}
	{#each options as option}
		<option class="text-black bg-white" value={option}>{option}</option>
	{/each}
</select>
