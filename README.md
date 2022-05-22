# CPU Visual Simulator

## Starting the app
```
npm install

npm run dev
```


## Instruction set
| Instruction | Description | Accepts operand | Accepts Immediate operand |
| ----------- | ----------- | --------------- | ------------------------- |
| NOP | No operation | no | no |
| HLT | Halt execution | no | no |
| JMP | Set Program Counter (PC) to the value of the operand | yes | no |
| JZ | If Zero flag (Z) is set, set Program Counter to the value of the operand | yes | no |
| JNZ | If not Zero flag (Z) is set, set Program Counter to the value of the operand | yes | no |
| JN | If Negative flag (N) is set, set Program Counter to the value of the operand | yes | no |
| JNN | If not Negative flag (N) is set, set Program Counter to the value of the operand | yes | no |
| LOD | Set Accumulator (ACC) to the value of the operand | yes | yes |
| STO | Store the value of the Accumulator (ACC) to the specified address | yes | no |
| ADD | Add the value of the operand to the value of the Accumulator (ACC) | yes | yes |
| SUB | Subtract from the value of the operand to the value of the Accumulator (ACC) | yes | yes |
| MUL | Multiply the value of the operand by the value of the Accumulator (ACC) | yes | yes |
| DIV | Divide the value of the operand by the value Accumulator (ACC) | yes | yes |
| AND | Bitwise AND operation between the value of the operand and the value of the Accumulator (ACC) | yes | yes |
| CMP | Compare the value of the Accumulator (ACC) to the value of the operand, the result of this comparison sets the values of the Status Word (SW) | yes | yes |
| NOT |  Bitwise NOT operation, sets the Accumulator (ACC) to the negated value of the operand | yes | yes |



## Operands
Most of the instructions accept an operand.
An operand can either be immediate or direct.


### Immediate operand
An operand is immediate when its values is preceded by an "#" symbol.

A valid immediate operand value must be between 127 and -128.

Examples of immediate operand:
```
LOD #120
MUL #-1
```


### Direct operand
An operand without the "#" symbol is a direct operand.

A direct operand represent the address at which the operand value is stored.

A valid direct operand must be a valid address, so it should be and even value between 0 and 254

Examples of direct operand:
```
LOD 120
JMP 22
```


### Label operands
Each address can be tagged with an unique label.

This label can be used while writing instructions in place of the address value.

So, if for example we tag the address 30 as "MY_LABEL", we could write the following instructions:
```
LOD MY_LABEL    // equals to LOD 30
ADD #MY_LABEL   // equals to ADD #30
```