import { get } from "svelte/store"
import { animationSpeed } from "../store/settings"
import Node, { Position } from "./Node"
import Wire from "./Wire"

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

const BASE_ANIM_SPEED = 400

export default class WireAnimation {
	private path: Node[]
	private wires: Wire[]
	private pos = { x: 0, y: 0 }
	private nextNodeIndex: number
	private nextNode: { distance: number; direction: { x: number; y: number }; node: Position }
	private previousTimestamp: DOMHighResTimeStamp
	private deltatime: number
	private incrementedX: number
	private incrementedY: number

	private resolve: () => Promise<void>

	constructor(nodesPath: Node[], wirePath: Wire[]) {
		this.path = [...nodesPath]
		this.wires = [...wirePath]
		this.reset()
	}

	async play() {
		return new Promise(this._play.bind(this))
	}
	private _play(resolve, reject) {
		this.resolve = resolve
		requestAnimationFrame(this.startAnimation.bind(this))
	}

	private startAnimation(timestamp: DOMHighResTimeStamp) {
		this.previousTimestamp = timestamp
		this.animate(timestamp)
	}

	private animate(timestamp: DOMHighResTimeStamp) {
		this.deltatime = (timestamp - this.previousTimestamp) / 1000
		const distance = Math.floor(this.deltatime * BASE_ANIM_SPEED * get(animationSpeed))
		this.draw(distance)
		if (
			this.pos.x === this.path[this.path.length - 1].x &&
			this.pos.y === this.path[this.path.length - 1].y
		) {
			cleanup()
			this.reset()
			this.resolve()
			return
		}
		this.previousTimestamp = timestamp
		requestAnimationFrame(this.animate.bind(this))
	}

	private draw(distanceToTravel: number) {
		ctx.beginPath()
		ctx.moveTo(this.pos.x, this.pos.y)
		while (distanceToTravel > 0) {
			this.nextNode = _nextNode(this.pos, this.path[this.nextNodeIndex], distanceToTravel)
			ctx.strokeStyle = this.wires[this.nextNodeIndex - 1].type.animationColor()
			while (
				(this.pos.x !== this.nextNode.node.x || this.pos.y !== this.nextNode.node.y) &&
				distanceToTravel > 0
			) {
				this.incrementedX = this.pos.x + this.nextNode.direction.x
				this.incrementedY = this.pos.y + this.nextNode.direction.y
				ctx.lineTo(this.incrementedX, this.incrementedY)
				ctx.stroke()
				this.pos.x = this.incrementedX
				this.pos.y = this.incrementedY
				distanceToTravel--
			}
			increaseTransparency(0.05)
			if (this.pos.x === this.path[this.nextNodeIndex].x && this.pos.y === this.path[this.nextNodeIndex].y) {
				this.nextNodeIndex++
				if (this.nextNodeIndex === this.path.length) {
					distanceToTravel = 0
				}
			}
		}
		ctx.closePath()
	}

	reset() {
		this.pos.x = this.path[0].x
		this.pos.y = this.path[0].y
		this.nextNodeIndex = 1
	}
}

export function setCanvas(_canvas: HTMLCanvasElement) {
	canvas = _canvas
	ctx = canvas.getContext("2d")
	ctx.lineCap = "round"
	ctx.lineWidth = Wire.WIDTH
}

function increaseTransparency(alpha) {
	ctx.save()
	ctx.globalAlpha = alpha
	ctx.globalCompositeOperation = "destination-out"
	ctx.fillStyle = "#FFF"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.restore()
}

function cleanup() {
	fadeRemainingTrail(0)
}

function fadeRemainingTrail(index) {
	increaseTransparency(0.1)
	index++
	if (index === 40) {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		return
	}
	requestAnimationFrame(() => fadeRemainingTrail(index))
}

function _nextNode(nodeA, nodeB, distanceLeft) {
	let direction = Node.direction(nodeA, nodeB)
	let distance = Node.distance(nodeA, nodeB)
	let nextNode = nodeB
	if (distance > distanceLeft) {
		distance = distanceLeft
		nextNode = _node(nodeA, distanceLeft, direction)
	}
	return {
		distance,
		direction,
		node: nextNode
	}
}

function _node(fromNode, distance, direction) {
	return {
		x: fromNode.x + distance * direction.x,
		y: fromNode.y + distance * direction.y
	}
}
