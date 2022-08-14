<script lang="ts">
	import Widget from "../Widget.svelte"
	import text from "../../../store/text"
	import {
		extDataBusColor,
		intDataBusColor,
		extDataBusAnimationColor,
		intDataBusAnimationColor,
		extAddressBusColor,
		intAddressBusColor,
		extAddressBusAnimationColor,
		intAddressBusAnimationColor,
		extControlBusColor,
		intControlBusColor,
		extControlBusAnimationColor,
		intControlBusAnimationColor
	} from "../../../store/settings"
</script>

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
