import { get } from "svelte/store"
import animationStore from "../store/animationStore"
import Node from "./Node"

export const ANIMATION_SPEED = 10 // px/second

let canvas: HTMLCanvasElement
let swap: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let swapCtx: CanvasRenderingContext2D
let width: number
let height: number

export function init(_canvas: HTMLCanvasElement, _swap: HTMLCanvasElement) {
	canvas = _canvas
	swap = _swap
	ctx = canvas.getContext("2d")
	swapCtx = swap.getContext("2d")
	width = canvas.width
	height = canvas.height
	ctx.lineWidth = 5
	ctx.strokeStyle = "#00FF00"
}

export default class WireAnimation {
	readonly path: Node[]

	private startTime: DOMHighResTimeStamp
	private previousTimeStamp: DOMHighResTimeStamp

	private currentX: number
	private currentY: number
	private nextX: number
	private nextY: number
	private xDirection: number
	private yDirection: number
	private nodeIndex: number
	private nextNodeIndex: number

	private isEnded: boolean

	private resolve: () => Promise<void>

	constructor(path: Node[]) {
		this.path = path
		this.reset()
	}

	async play() {
		return new Promise(this._play.bind(this))
	}

	private frame(timestamp: DOMHighResTimeStamp): void {
		if (this.startTime === undefined) {
			this.startTime = timestamp
		}
		if (this.previousTimeStamp !== timestamp) {
			const elapsed = timestamp - this.startTime
			const total =
				(ANIMATION_SPEED / 1000) * elapsed * get(animationStore).animationSpeedMultiplier
			let toTravel = total
			let traveled = 0
			this.fade()
			while (traveled < total) {
				this.updateDirection()
				this.updateNextPos(toTravel)
				this.draw()
				traveled = this.traveled()
				toTravel -= traveled
				console.log(traveled)
				this.updateCurrentPos()
				this.updateNodeIndex()
			}
			if (this.currentX === this.lastNode().x && this.currentY === this.lastNode().y) {
				this.isEnded = true
			}
		}
		if (this.isEnded) {
			this.resolve()
			this.cleanup()
			return
		}

		this.previousTimeStamp = timestamp
		requestAnimationFrame(this.frame.bind(this))
	}

	private updateNextPos(distanceToTravel: number) {
		this.nextX = this.currentX + distanceToTravel * this.xDirection
		this.nextY = this.currentY + distanceToTravel * this.yDirection
	}

	private updateDirection() {
		if (this.currentNode().x === this.nextNode().x) {
			this.xDirection = 0
		} else if (this.currentNode().x < this.nextNode().x) {
			this.xDirection = 1
		} else {
			this.xDirection = -1
		}
		if (this.currentNode().y === this.nextNode().y) {
			this.yDirection = 0
		} else if (this.currentNode().y < this.nextNode().y) {
			this.yDirection = 1
		} else {
			this.yDirection = -1
		}
	}

	private draw() {
		ctx.beginPath()
		ctx.moveTo(this.currentX, this.currentY)
		ctx.lineTo(this.nextX, this.nextY)
		ctx.stroke()
	}

	private traveled(): number {
		if (this.currentX === this.nextX) {
			return Math.abs(this.nextY - this.currentY)
		} else {
			return Math.abs(this.nextX - this.currentX)
		}
	}

	private updateCurrentPos() {
		this.currentX = this.nextX
		this.currentY = this.nextY
	}

	private updateNodeIndex() {
		if (this.currentX === this.nextNode().x && this.currentY === this.nextNode().y) {
			this.nodeIndex++
			this.nextNodeIndex++
		}
	}

	private fade() {
		swapCtx.clearRect(0, 0, width, height)
		swapCtx.drawImage(canvas, 0, 0)
		ctx.clearRect(0, 0, width, height)
		ctx.drawImage(swap, 0, 0)
	}

	private cleanup() {}

	reset(): void {
		this.isEnded = false
		this.nodeIndex = 0
		this.nextNodeIndex = 1
		this.currentX = this.currentNode().x
		this.currentY = this.currentNode().y
	}

	private currentNode() {
		return this.path[this.nodeIndex]
	}

	private nextNode() {
		return this.path[this.nextNodeIndex]
	}

	private lastNode() {
		return this.path[this.path.length - 1]
	}

	private _play(resolve, reject) {
		this.resolve = resolve
		requestAnimationFrame(this.frame.bind(this))
	}
}
