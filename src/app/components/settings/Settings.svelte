<script lang="ts">
	import text from "../../store/text"
	import {
		displayBussesLabels,
		displayComponentsLabels,
		displayStepText,
		language,
		showSettings,
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
	import {
		extAddressBusAnimationColor,
		extAddressBusColor,
		extControlBusAnimationColor,
		extControlBusColor,
		extDataBusAnimationColor,
		extDataBusColor,
		intAddressBusAnimationColor,
		intAddressBusColor,
		intControlBusAnimationColor,
		intControlBusColor,
		intDataBusAnimationColor,
		intDataBusColor
	} from "../../store/settings"
	import LanguageSelect from "../../../shared/components/LanguageSelect.svelte"
	import speechSynthesis from "../../util/speechSynthesis"

	function closeSettings() {
		$showSettings = false
		Logger.info("Settings closed", "USER_INPUT")
	}
</script>

{#if $showSettings}
	<div
		class="fixed w-screen h-screen top-0 left-0 bg-gray-100 overflow-y-auto"
		transition:fade={{ duration: 75 }}
	>
		<div class="w-full flex flex-row items-center justify-between pt-3 pb-5 px-9 border-b border-neutral-500">
			<h1 class="text-[2.8rem] font-bold">{$text.settings.title}</h1>
			<CloseButton on:click={closeSettings} />
		</div>
		<div class="w-full flex flex-col">
			<Widget title={$text.settings.language.title} description={$text.settings.language.description}>
				<LanguageSelect bind:value={$language} />
			</Widget>
			<Widget
				title={$text.settings.dispaly_components_labels.title}
				description={$text.settings.dispaly_components_labels.description}
			>
				<Toggle bind:checked={$displayComponentsLabels} />
			</Widget>
			<Widget
				title={$text.settings.dispaly_busses_labels.title}
				description={$text.settings.dispaly_busses_labels.description}
			>
				<Toggle bind:checked={$displayBussesLabels} />
			</Widget>
			<Widget
				title={$text.settings.display_step_text.title}
				description={$text.settings.display_step_text.description}
			>
				<Toggle bind:checked={$displayStepText} />
			</Widget>
			<Widget title={$text.settings.tts_enabled.title} description={$text.settings.tts_enabled.description}>
				<Toggle bind:checked={$ttsEnabled} />
			</Widget>
			<Widget title={$text.settings.tts_speed.title} description={$text.settings.tts_speed.description}>
				<div class="w-36 flex flex-col items-center justify-center">
					<p>{$ttsSpeed}</p>
					<Slider min={0.5} max={1.5} bind:value={$ttsSpeed} />
				</div>
			</Widget>
			<Widget title={$text.settings.tts_voice.title} description={$text.settings.tts_voice.description}>
				<Select
					options={speechSynthesis.getAvailableVoices($language).map(v => v.name)}
					bind:value={$ttsVoice}
				/>
			</Widget>
			<Widget
				title={$text.settings.databus_ext_color.title}
				description={$text.settings.databus_ext_color.description}
			>
				<input type="color" bind:value={$extDataBusColor} />
			</Widget>
			<Widget
				title={$text.settings.databus_int_color.title}
				description={$text.settings.databus_int_color.description}
			>
				<input type="color" bind:value={$intDataBusColor} />
			</Widget>
			<Widget
				title={$text.settings.databus_ext_anim_color.title}
				description={$text.settings.databus_ext_anim_color.description}
			>
				<input type="color" bind:value={$extDataBusAnimationColor} />
			</Widget>
			<Widget
				title={$text.settings.databus_int_anim_color.title}
				description={$text.settings.databus_int_anim_color.description}
			>
				<input type="color" bind:value={$intDataBusAnimationColor} />
			</Widget>
			<Widget
				title={$text.settings.addressbus_ext_color.title}
				description={$text.settings.addressbus_ext_color.description}
			>
				<input type="color" bind:value={$extAddressBusColor} />
			</Widget>
			<Widget
				title={$text.settings.addressbus_int_color.title}
				description={$text.settings.addressbus_int_color.description}
			>
				<input type="color" bind:value={$intAddressBusColor} />
			</Widget>
			<Widget
				title={$text.settings.addressbus_ext_anim_color.title}
				description={$text.settings.addressbus_ext_anim_color.description}
			>
				<input type="color" bind:value={$extAddressBusAnimationColor} />
			</Widget>
			<Widget
				title={$text.settings.addressbus_int_anim_color.title}
				description={$text.settings.addressbus_int_anim_color.description}
			>
				<input type="color" bind:value={$intAddressBusAnimationColor} />
			</Widget>

			<Widget
				title={$text.settings.controlbus_ext_color.title}
				description={$text.settings.controlbus_ext_color.description}
			>
				<input type="color" bind:value={$extControlBusColor} />
			</Widget>
			<Widget
				title={$text.settings.controlbus_int_color.title}
				description={$text.settings.controlbus_int_color.description}
			>
				<input type="color" bind:value={$intControlBusColor} />
			</Widget>
			<Widget
				title={$text.settings.controlbus_ext_anim_color.title}
				description={$text.settings.controlbus_ext_anim_color.description}
			>
				<input type="color" bind:value={$extControlBusAnimationColor} />
			</Widget>
			<Widget
				title={$text.settings.controlbus_int_anim_color.title}
				description={$text.settings.controlbus_int_anim_color.description}
			>
				<input type="color" bind:value={$intControlBusAnimationColor} />
			</Widget>
		</div>
	</div>
{/if}
