<script lang="ts">
	type Icon = "" | "reset" | "play" | "pause" | "skip"
	export let disabled = false
	export let title = ""
	export let icon: Icon = ""

	const PATHS = {
		"": "",
		reset:
			"M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z",
		play: "M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z",
		pause:
			"M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z",
		skip: "M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"
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
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		class="fill-black w-6 h-6 scale-[1.4]"
	>
		<path d={PATHS[icon]} />
	</svg>
</button>
