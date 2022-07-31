<script lang="ts">
	import lang from "../../store/lang"
	import {
		availableTtsVoices,
		displayLabels,
		displayStepText,
		language,
		showSettings,
		SUPPORTED_LANGS,
		ttsEnabled,
		ttsSpeed,
		ttsVoice
	} from "../../store/settings"
	import Logger from "../../util/logger"
	import CloseButton from "../basic/buttons/close/Settings.svelte"
	import Widget from "./Widget.svelte"
	import { fade } from "svelte/transition"
	import Toggle from "../basic/checkboxes/Settings.svelte"
	import Select from "../basic/selects/Settings.svelte"
	import Slider from "../basic/slider/Settings.svelte"

	function closeSettings() {
		$showSettings = false
		Logger.info("Settings closed", "USER_INPUT")
	}
</script>

{#if $showSettings}
	<div class="fixed w-screen h-screen top-0 left-0 bg-gray-100" transition:fade={{ duration: 75 }}>
		<div class="w-full flex flex-row items-center justify-between pt-3 pb-5 px-9 border-b border-neutral-500">
			<h1 class="text-[2.8rem] font-bold">{$lang.settings.title}</h1>
			<CloseButton on:click={closeSettings} />
		</div>
		<div class="w-full flex flex-col">
			<Widget title={$lang.settings.language.title} description={$lang.settings.language.description}>
				<Select options={[...SUPPORTED_LANGS]} bind:value={$language} />
			</Widget>
			<Widget
				title={$lang.settings.dispaly_labels.title}
				description={$lang.settings.dispaly_labels.description}
			>
				<Toggle bind:checked={$displayLabels} />
			</Widget>
			<Widget
				title={$lang.settings.display_step_text.title}
				description={$lang.settings.display_step_text.description}
			>
				<Toggle bind:checked={$displayStepText} />
			</Widget>
			<Widget title={$lang.settings.tts_enabled.title} description={$lang.settings.tts_enabled.description}>
				<Toggle bind:checked={$ttsEnabled} />
			</Widget>
			<Widget title={$lang.settings.tts_speed.title} description={$lang.settings.tts_speed.description}>
				<div class="w-36 flex flex-col items-center justify-center">
					<p>{$ttsSpeed}</p>
					<Slider min={0.5} max={1.5} bind:value={$ttsSpeed} />
				</div>
			</Widget>
			<Widget title={$lang.settings.tts_voice.title} description={$lang.settings.tts_voice.description}>
				<Select options={$availableTtsVoices.map(v => v.name)} bind:value={$ttsVoice} />
			</Widget>
		</div>
	</div>
{/if}
