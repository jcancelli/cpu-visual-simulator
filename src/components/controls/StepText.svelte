<script lang="ts">
	import Widget from "./Widget.svelte"

	let text = ""

	export function setText(txt: string) {
		text = txt
	}
</script>

<Widget class="justify-center">
	<p class="w-[450px] text-gray-200 overflow-hidden leading-4">
		{text}
	</p>
</Widget>
