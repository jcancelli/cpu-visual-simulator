<script lang="ts">
	export let title: string = ""
	export let h: 1 | 2 | 3 | 4 = 2
</script>

{#if h === 1}
	<h1 class="font-bold text-4xl mb-5">{title}</h1>
{:else if h === 2}
	<h2 class="font-bold text-3xl mb-5">{title}</h2>
{:else if h === 3}
	<h3 class="font-bold text-2xl mb-3">{title}</h3>
{:else if h === 4}
	<h4 class="font-bold text-md mb-2">{title}</h4>
{/if}
<div class="px-6 mb-8">
	<slot />
</div>
