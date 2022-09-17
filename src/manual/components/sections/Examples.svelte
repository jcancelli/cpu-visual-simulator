<script lang="ts">
	import text from "../../stores/text"
	import CodeBlock from "../CodeBlock.svelte"
	import Section from "../Section.svelte"
</script>

<Section title={$text.sections.examples.subsections.if_then_else.title}>
	<div class="w-full flex flex-wrap justify-center gap-10">
		<!-- prettier-ignore -->
		<CodeBlock>
IF (condition)
THEN
	instruction_1
ELSE
	instruction_2
ENDIF
instruction_3
		</CodeBlock>
		<!-- prettier-ignore -->
		<CodeBlock>
IF (X == 3)
THEN
	Y = Y + 5
ELSE
	Z = Z + 2
ENDIF
X = 8
		</CodeBlock>
		<!-- prettier-ignore -->
		<CodeBlock>
			<!-- &zwnj; is there so that leading whitespaces are not removed, it should be an invisible character -->
&zwnj;               LOD X
               CMP #3
               JNZ ELSE
THEN:          LOD #5
               ADD Y
               STO Y
               JMP ENDIF
ELSE:          LOD #2
               ADD Z
               STO Z
ENDIF:         LOD #8
               STO X
               HLT
X:             3
Y:             0
Z:             0
		</CodeBlock>
	</div>
</Section>
<Section title={$text.sections.examples.subsections.do_while.title}>
	<div class="w-full flex flex-wrap justify-center gap-10">
		<!-- prettier-ignore -->
		<CodeBlock>
instruction_1
WHILE (condition)
DO
	instruction_2
	instruction_3
ENDWHILE
		</CodeBlock>
		<!-- prettier-ignore -->
		<CodeBlock>
SUM = 0
COUNT = 0
WHILE COUNT != MAX
DO
	COUNT = COUNT + 1
	SUM = SUM + COUNT
ENDWHILE
		</CodeBlock>
		<!-- prettier-ignore -->
		<CodeBlock>
			<!-- &zwnj; is there so that leading whitespaces are not removed, it should be an invisible character -->
&zwnj;               LOD #0
               STO SUM
               STO COUNT
WHILE:         LOD COUNT
               CMP MAX
               JZ ENDWHILE
               ADD #1
               STO COUNT
               ADD SUM
               STO SUM
               JMP WHILE
ENDWHILE:      HLT
MAX:           5
COUNT:         0
SUM:           0
		</CodeBlock>
	</div>
</Section>
