## Bugs

- [ ] ALU component misalligned on safari
- [ ] Broken animations on firefox + linux
- [ ] Programs stored in local storage not being loaded

## Improvements

- [x] Better actions granularity
- [x] Ability of displaying the value of a bus signal
- [x] Actual routing
- [ ] Touch support
- [ ] Better accessibility
    - [ ] Better screen reader friendlyness (aria properties like describedby and so on...)
    - [ ] Better keyboard-only navigation
    - [ ] Support for reduced motion
- [x] Dark mode support
- [ ] Hexadecimal display mode
- [ ] Possibility to "revert" instructions and steps. Basicaly an undo button for execution.
- [ ] Local storage versioning

## "We'll see" improvements

- Individual speeds for flash animations and wire animations
- Better introduction/about page for the manual
- Manual page where you can display an instruction with different formats
- Utility page where tools for creating localizations are available (like tools for text to speech testing and displaying text)
    - Also a few words about the philosophy of free educational software
- Telemetry
    - Umanmi maybe?
    - Privacy notice page
- Custom keyboard shortcuts
- Manual page with a guide for the UI
- Integrated code editor (maybe codemirror? Should check it's license)
- Advanced mode
    - Multiple registers
    - Extended instruction set (call, ret, push, pop)
    - Indirect operands
    - More status flags
    - Memory mapped IO (extremelly ambitious, but maybe users could write plugins for cpuvs and "mount" them as io devices)

## "We'll see" changes

- Consider changing behavior of immediate label operands.
  Current: `LOD #LABEL` with LABEL assigned to 254 (or any other address outside 8-bit signed range [0,127]) errors out
  Idea: cast it to signed integer
- Disconnect address bus from operand bus and connect it to the bottom of the MUX.
  This way if the opcode needs to be put on the address bus it needs to be sent through the MUX first.
  The control unit should also select input/output of the mux.
  Rename it from MUX to crossbar or just switch

## TODO (Technical stuff)

- Document all modules with jsdoc
- Make it so that eslint doesn't bitch about unused types when the types are only used in the JsDoc comments
- Add circular dependency linting
