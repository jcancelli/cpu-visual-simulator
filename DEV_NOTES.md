# Milestones

- [ ] Add an actual licens (maybe MIT?)
- [ ] UI
    - [ ] RAM
        - [ ] Address
        - [ ] Instruction
        - [ ] Ram wrapper
    - [ ] Labels
    - [ ] CPU
        - [ ] ALU
        - [ ] MUX
        - [ ] Status word
        - [ ] Instruction register
        - [ ] Program counter
        - [ ] PC Increment
        - [ ] Control unit/decoder
        - [ ] Accumulator
    - [ ] Control bar
    - [ ] Notifications
    - [ ] Navbar
    - [ ] Components animations
    - [ ] Styling
        - [ ] Define color pallete
        - [ ] Define commpon components and styles
        - [ ] Pick UI library (maybe Flowbite?)
- [ ] Wires
    - [ ] WebGPU implementation
    - [ ] WebGL fallback implementation
    - [ ] Canvas fallback implementation
    - [ ] Ability to pause/cancel animations while they are still running
- [ ] Notifications
    - [ ] Fixed notifications for each environment (ex. the warning for jcancelli.github.io/cpu-visual-simulator)
- [ ] Define text
    - [ ] English localization
    - [ ] Italian localization
    - [ ] Spanish localization
- [ ] Manual
    - [ ] Introduction
    - [ ] Instructionset
    - [ ] Keyboard shortcuts
    - [ ] Code files
    - [ ] Examples
- [ ] Copyright page
- [ ] Settings
    - [ ] Accessibility
        - [ ] Busses colors
        - [ ] TTS settings
    - [ ] Toggles
        - [ ] Toggle busses labels
        - [ ] Toggle components labels
        - [ ] Toggle step text
- [ ] Keyboard shortcuts
- [ ] Instructions
    - [ ] Parsing
    - [ ] Decoding
    - [ ] Validating
- [ ] Loading/saving programs
    - [ ] To URL
    - [ ] To file
    - [ ] To local storage
    - [ ] Loading examples
- [ ] Touch support
- [ ] Execution
    - [ ] Define steps
    - [ ] Implement task system
    - [ ] Implement actions
- [ ] State
    - [x] Memory
    - [x] Labels
    - [x] Cpu
    - [ ] Local storage persistence
        - [ ] Local storage versioning

# TODO

- Add jsdoc comments to the top of all the files

# Bugs

- [ ] ALU component misalligned on safari

# "We'll see" changes

- [ ] Consider changing behavior of immediate label operands.
      Current: `LOD #LABEL` with LABEL assigned to 254 (or any other address outside 8-bit signed range [0,127]) errors out
      Idea: cast it to signed integer
- [ ] Define granularity of the steps

# Improvements

- [x] Better actions granularity
- [x] Possibility of displaying the value of a bus signal
- [x] Actual routing
- [ ] Touch support

# "We'll see" improvements

- [ ] Manual page where you can display an instruction with different formats
- [ ] Utility page where tools for creating localizations are available (like tools for text to speech testing and displaying text)
- [ ] Telemetry, maybe just a ping sent to something like a vercel free tier just to know how many users there are
- [ ] Custom keyboard shortcuts
- [ ] Pause at any time
    - [ ] Pause/cancel animation in the middle of them
- [ ] Manual page with a guide for the UI
- [ ] Integrated code editor (maybe codemirror? Should check it's license)
