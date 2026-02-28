<script lang="ts">
	import "./layout.css"
	import favicon from "$lib/assets/favicon.png"
	import { page } from "$app/state"
	import { locales, localizeHref } from "$lib/paraglide/runtime"

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- https://tailwindcss.com/docs/dark-mode#with-system-theme-support -->
	<script>
		document.documentElement.classList.toggle(
			"dark",
			localStorage.theme === "dark"
				|| (!("theme" in localStorage)
					&& window.matchMedia("(prefers-color-scheme: dark)").matches),
		)
	</script>
</svelte:head>

{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/each}
</div>
