<script lang="ts">
	import TabGroup from "./basic/tabs/TabGroup.svelte"
	import TabList from "./basic/tabs/TabList.svelte"
	import Tab from "./basic/tabs/Tab.svelte"
	import TabPanels from "./basic/tabs/TabPanels.svelte"
	import TabPanel from "./basic/tabs/TabPanel.svelte"
	import text from "../stores/text"
	import InstructionSetSection from "./sections/InstructionSet.svelte"
</script>

<TabGroup class="p-5">
	<TabList class="mt-4">
		<Tab class="border-t border-t-gray-500">{$text.sections.instruction_set.title}</Tab>
		<Tab>Examples</Tab>
		<Tab>Playground</Tab>
		<Tab>Credits</Tab>
	</TabList>
	<TabPanels>
		<TabPanel>
			<InstructionSetSection />
		</TabPanel>
		<TabPanel>
			<h1>Hello world</h1>
		</TabPanel>
	</TabPanels>
</TabGroup>
