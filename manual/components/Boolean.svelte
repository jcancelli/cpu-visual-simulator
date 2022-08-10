<script lang="ts">
	import text from "../stores/text"

	export let value: boolean
</script>

<p class={value ? "text-green-700" : "text-red-700"}>
	{value ? $text.bool.true : $text.bool.false}
</p>
