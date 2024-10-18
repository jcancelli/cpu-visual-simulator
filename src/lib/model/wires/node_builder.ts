import { InvalidArgumentError } from "$lib/errors/util"
import { NodeBlueprint } from "./node"

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

	width(width: number): NodeBuilder {
		if (width < 0) {
			throw new InvalidArgumentError(`Width ${width} is not greater than 0`)
		}
		this._width = width
		return this
	}

	height(height: number): NodeBuilder {
		if (height < 0) {
			throw new InvalidArgumentError(`Height ${height} is not greater than 0`)
		}
		this._height = height
		return this
	}

	x(x: number): NodeBuilder {
		if (x < 0 || x > this._width) {
			throw new InvalidArgumentError(
				`Value of x (${x}) is not between 0 and width (${this._width})`
			)
		}
		this._x = x
		return this
	}

	y(y: number): NodeBuilder {
		if (y < 0 || y > this._height) {
			throw new InvalidArgumentError(
				`Value of y (${y}) is not between 0 and height (${this._height})`
			)
		}
		this._y = y
		return this
	}

	pos(x: number, y: number): NodeBuilder {
		return this.x(x).y(y)
	}

	build(id: string): NodeBlueprint {
		const x = this._x === 0 ? 0 : this._width / this._x
		const y = this._y === 0 ? 0 : this._height / this._y
		return new NodeBlueprint(x, y, id)
	}
}
