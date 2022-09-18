<script lang="ts">
	import TabGroup from "../../shared/components/tabs/TabGroup.svelte"
	import TabList from "../../shared/components/tabs/TabList.svelte"
	import Tab from "../../shared/components/tabs/Tab.svelte"
	import TabPanels from "../../shared/components/tabs/TabPanels.svelte"
	import TabPanel from "../../shared/components/tabs/TabPanel.svelte"
	import text from "../stores/text"
	import InstructionSetSection from "./sections/InstructionSet.svelte"
	import Introduction from "./sections/Introduction.svelte"
	import Examples from "./sections/Examples.svelte"
	import Copyright from "./sections/Copyright.svelte"
</script>

<TabGroup class="p-5">
	<TabList class="mt-4">
		<Tab class="border-t border-t-gray-500">{$text.sections.introduction.title}</Tab>
		<Tab>{$text.sections.instruction_set.title}</Tab>
		<Tab>{$text.sections.ui.title}</Tab>
		<Tab>{$text.sections.examples.title}</Tab>
		<Tab>{$text.sections.copyright.title}</Tab>
		<Tab>{$text.sections.credits.title}</Tab>
	</TabList>
	<TabPanels class="py-7 px-14">
		<TabPanel>
			<Introduction />
		</TabPanel>
		<TabPanel>
			<InstructionSetSection />
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
		<TabPanel>
			<Examples />
		</TabPanel>
		<TabPanel>
			<Copyright />
		</TabPanel>
		<TabPanel>
			<h1 class="text-center font-bold text-4xl">TODO</h1>
		</TabPanel>
	</TabPanels>
</TabGroup>
