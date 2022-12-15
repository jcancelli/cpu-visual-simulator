import { StateChangeEvent } from "./StateChangeEvent"

export default class StateChangesTracker {
	private events: StateChangeEvent<any, any>[]

	constructor() {
		this.events = []
	}

	public track(event: StateChangeEvent<any, any>): void {
		if (this.peek()?.endsInstruction) {
			this.events = []
		}
		this.events.push(event)
	}

	public restoreInstruction(): void {
		let event = this.peek()
		while (event && !event.endsInstruction) {
			this.events.pop()
			event.restore()
			event = this.peek()
		}
	}

	public restoreStep(): void {
		let event = this.peek()
		while (event && !event.endsStep) {
			this.events.pop()
			event.restore()
			event = this.peek()
		}
	}

	protected peek(): StateChangeEvent<any, any> {
		const event = this.events.pop()
		this.events.push(event)
		return event
	}
}
