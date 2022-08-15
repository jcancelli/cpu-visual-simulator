<script lang="ts">
	import Base from "./Base.svelte"

	export let disabled = false
</script>

<Base
	class="
        border-blue-700
        hover:bg-blue-700
    "
	on:click
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
>
	<slot />
</Base>
