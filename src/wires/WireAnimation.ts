import { get } from "svelte/store"
import animationStore from "../store/animationStore"
import Node from "./Node"

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

const BASE_ANIM_SPEED = 400

export default class WireAnimation {
	private path: Node[]
	private pos = { x: 0, y: 0 }
	private nextNodeIndex: number

	private previousTimestamp: DOMHighResTimeStamp
	private deltatime: number

	private resolve: () => Promise<void>

	constructor(nodesPath: Node[]) {
		this.path = [...nodesPath]
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
		const distance = Math.floor(
			this.deltatime * BASE_ANIM_SPEED * get(animationStore).animationSpeedMultiplier
		)
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
		let next, incrementedX, incrementedY
		ctx.lineWidth = 5
		ctx.strokeStyle = "lime"
		ctx.lineCap = "square"
		ctx.beginPath()
		ctx.moveTo(this.pos.x, this.pos.y)
		while (distanceToTravel > 0) {
			next = _nextNode(this.pos, this.path[this.nextNodeIndex], distanceToTravel)
			while ((this.pos.x !== next.node.x || this.pos.y !== next.node.y) && distanceToTravel > 0) {
				incrementedX = this.pos.x + next.direction.x
				incrementedY = this.pos.y + next.direction.y
				ctx.lineTo(incrementedX, incrementedY)
				ctx.stroke()
				this.pos.x = incrementedX
				this.pos.y = incrementedY
				distanceToTravel--
			}
			increaseTransparency(0.05)
			if (
				this.pos.x === this.path[this.nextNodeIndex].x &&
				this.pos.y === this.path[this.nextNodeIndex].y
			) {
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
	let direction = _direction(nodeA, nodeB)
	let distance = _distance(nodeA, nodeB)
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

function _direction(nodeA, nodeB) {
	if (nodeA.x > nodeB.x) {
		return { x: -1, y: 0 }
	} else if (nodeA.x < nodeB.x) {
		return { x: 1, y: 0 }
	} else {
		if (nodeA.y > nodeB.y) {
			return { x: 0, y: -1 }
		} else {
			return { x: 0, y: 1 }
		}
	}
}

function _distance(nodeA, nodeB) {
	return Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y)
}

function _node(fromNode, distance, direction) {
	return {
		x: fromNode.x + distance * direction.x,
		y: fromNode.y + distance * direction.y
	}
}
