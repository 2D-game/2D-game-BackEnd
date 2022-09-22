import { IObject, NullObject } from '../object'
import { Wall } from '../object/wall/Wall'

export type SpawnPoint = {
	x: number
	y: number
}

export class Map {
	private readonly height: number
	private readonly width: number
	private readonly spawnPoint: SpawnPoint
	private readonly objects: IObject[][]

	constructor(height: number, width: number, spawnPoint: SpawnPoint) {
		this.height = height
		this.width = width
		this.spawnPoint = spawnPoint

		this.objects = new Array(height)
		for (let i = 0; i < height; i++) {
			this.objects[i] = new Array(width)
			for (let j = 0; j < width; j++) {
				this.objects[i][j] = new NullObject()
			}
		}
	}

	getHeight(): number {
		return this.height
	}

	getWidth(): number {
		return this.width
	}

	getSpawnPoint(): SpawnPoint {
		return this.spawnPoint
	}

	getObjectAt(x: number, y: number): IObject {
		return this.objects[y][x]
	}

	public addWallOutline(): this {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (i === 0 || i === this.height - 1 || j === 0 || j === this.width - 1) {
					this.objects[i][j] = new Wall()
				}
			}
		}
		return this
	}
}
