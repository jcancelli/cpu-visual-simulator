<script lang="ts">
	import Widget from "../Widget.svelte"
	import text from "../../../store/text"
	import { language, ttsEnabled, ttsSpeed, ttsVoice } from "../../../store/settings"
	import Slider from "../../../../shared/components/slider/Settings.svelte"
	import Select from "../Select.svelte"
	import speechSynthesis from "../../../util/speechSynthesis"
	import Switch from "../../../../shared/components/Switch.svelte"
</script>

<Widget title={$text.settings.tts_enabled.title} description={$text.settings.tts_enabled.description}>
	<Switch bind:checked={$ttsEnabled} />
</Widget>
<Widget title={$text.settings.tts_speed.title} description={$text.settings.tts_speed.description}>
	<div class="w-36 flex flex-col items-center justify-center">
		<p>{$ttsSpeed}</p>
		<Slider min={0.5} max={1.5} bind:value={$ttsSpeed} />
	</div>
</Widget>
<Widget title={$text.settings.tts_voice.title} description={$text.settings.tts_voice.description}>
	<Select options={speechSynthesis.getAvailableVoices($language).map(v => v.name)} bind:value={$ttsVoice} />
</Widget>
