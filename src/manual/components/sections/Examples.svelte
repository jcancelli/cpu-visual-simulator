<script lang="ts">
	import text from "../../stores/text"

	import CodeBlock from "../CodeBlock.svelte"
	import SubSection from "../SubSection.svelte"

	const ifThenElseHighLevel = `
IF (condition)
THEN
	instruction_1
ELSE
	instruction_2
ENDIF
instruction_3
`
	const ifThenElseCode = `
IF (X == 3)
THEN
	Y = Y + 5
ELSE
	Z = Z + 2
ENDIF
X = 8      
`
	const ifThenElseAssembly = `
LOD X
CMP #3
JNZ ELSE
LOD #5		:THEN
ADD Y
STO Y
JMP ENDIF
LOD #2		:ELSE
ADD Z
STO Z
LOD #8		:ENDIF
STO X
HLT
3			:X
0			:Y
0			:Z
`
	const whileDoHighLevel = `
instruction_1
WHILE (condition)
DO
	instruction_2
	instruction_3
ENDWHILE
`
	const whileDoCode = `
SUM = 0
COUNT = 0
WHILE COUNT != MAX
DO
	COUNT = COUNT + 1
	SUM = SUM + COUNT
ENDWHILE
`
	const whileDoAssembly = `
LOD #0
STO SUM
STO COUNT
LOD COUNT		:WHILE
CMP MAX
JZ ENDWHILE
ADD #1
STO COUNT
ADD SUM
STO SUM
JMP WHILE
HLT				:ENDWHILE
5				:MAX
0				:COUNT
0				:SUM
`
</script>

<SubSection title={$text.sections.examples.subsections.if_then_else.title}>
	<div class="w-full flex flex-wrap justify-center gap-10 mb-7">
		<CodeBlock>{ifThenElseHighLevel}</CodeBlock>
		<CodeBlock>{ifThenElseCode}</CodeBlock>
		<CodeBlock>{ifThenElseAssembly}</CodeBlock>
	</div>
</SubSection>
<SubSection title={$text.sections.examples.subsections.do_while.title}>
	<div class="w-full flex flex-wrap justify-center gap-10 mb-7">
		<CodeBlock>{whileDoHighLevel}</CodeBlock>
		<CodeBlock>{whileDoCode}</CodeBlock>
		<CodeBlock>{whileDoAssembly}</CodeBlock>
	</div>
</SubSection>
