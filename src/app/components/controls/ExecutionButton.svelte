<script lang="ts">
	type Icon = keyof typeof PATHS
	export let disabled = false
	export let title = ""
	export let icon: Icon = ""

	const PATHS = {
		"": "",
		reset:
			"M9.825 20.7q-2.575-.725-4.2-2.837Q4 15.75 4 13q0-1.425.475-2.713Q4.95 9 5.825 7.925q.275-.3.675-.313.4-.012.725.313.275.275.288.675.012.4-.263.75-.6.775-.925 1.7Q6 11.975 6 13q0 2.025 1.188 3.613 1.187 1.587 3.062 2.162.325.1.538.375.212.275.212.6 0 .5-.35.788-.35.287-.825.162Zm4.35 0q-.475.125-.825-.175t-.35-.8q0-.3.213-.575.212-.275.537-.375 1.875-.6 3.062-2.175Q18 15.025 18 13q0-2.5-1.75-4.25T12 7h-.075l.4.4q.275.275.275.7 0 .425-.275.7-.275.275-.7.275-.425 0-.7-.275l-2.1-2.1q-.15-.15-.212-.325Q8.55 6.2 8.55 6t.063-.375q.062-.175.212-.325l2.1-2.1q.275-.275.7-.275.425 0 .7.275.275.275.275.7 0 .425-.275.7l-.4.4H12q3.35 0 5.675 2.325Q20 9.65 20 13q0 2.725-1.625 4.85-1.625 2.125-4.2 2.85Z",
		play: "M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z",
		pause:
			"M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z",
		fast: "M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
	}
</script>

<button
	class="
        flex
        items-center
        justify-center
        w-9
        h-9
        border
        border-black
        rounded-md
        bg-white
        disabled:brightness-[.6]
        disabled:cursor-default
        active:brightness-90
        {$$restProps.class}
    "
	on:click
	on:focus
	on:focusout
	on:mouseenter
	on:mouseleave
	on:mouseover
	{disabled}
	{title}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-black w-6 h-6 scale-[1.4]">
		<path d={PATHS[icon]} />
	</svg>
</button>
