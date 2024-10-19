import { InvalidArgumentError } from "$lib/errors/util"
import type { NodeBlueprint } from "./node"

export default class NodeBuilder {
	private _x: number = 0
	private _y: number = 0

	constructor(
		private _width: number = 1.0,
		private _height: number = 1.0
	) {
		if (_width < 0) {
			throw new InvalidArgumentError(`Width ${_width} is not greater than 0`)
		}
		if (_height < 0) {
			throw new InvalidArgumentError(`Height ${_height} is not greater than 0`)
		}
	}

	setWidth(width: number): NodeBuilder {
		if (width < 0) {
			throw new InvalidArgumentError(`Width ${width} is not greater than 0`)
		}
		this._width = width
		return this
	}

	setHeight(height: number): NodeBuilder {
		if (height < 0) {
			throw new InvalidArgumentError(`Height ${height} is not greater than 0`)
		}
		this._height = height
		return this
	}

	setX(x: number): NodeBuilder {
		if (x < 0 || x > this._width) {
			throw new InvalidArgumentError(
				`Value of x (${x}) is not between 0 and width (${this._width})`
			)
		}
		this._x = x
		return this
	}

	setY(y: number): NodeBuilder {
		if (y < 0 || y > this._height) {
			throw new InvalidArgumentError(
				`Value of y (${y}) is not between 0 and height (${this._height})`
			)
		}
		this._y = y
		return this
	}

	setPosition(x: number, y: number): NodeBuilder {
		return this.setX(x).setY(y)
	}

	build(id: string): NodeBlueprint {
		const x = this._x === 0 ? 0 : this._width / this._x
		const y = this._y === 0 ? 0 : this._height / this._y
		return { id, x, y }
	}
}
