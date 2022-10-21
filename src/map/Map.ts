import { IObject, NullObject } from '../object'
import { Finish } from '../object/Finish'
import { Wall } from '../object/wall/Wall'

export type Coordinates = {
	x: number
	y: number
}

export type SpawnPoint = Coordinates

export class Map implements Cloneable {
	private readonly height: number
	private readonly width: number
	private readonly spawnPoint: SpawnPoint
	private readonly finishPoint : Coordinates
	private readonly objects: IObject[][]

	constructor(height: number, width: number, spawnPoint: SpawnPoint, finishPoint : Coordinates) {
		this.height = height
		this.width = width
		this.spawnPoint = spawnPoint
		this.finishPoint = finishPoint

		this.objects = new Array(height)
		for (let i = 0; i < height; i++) {
			this.objects[i] = new Array(width)
			for (let j = 0; j < width; j++) {
				this.objects[i][j] = new NullObject()
			}
		}

		this.objects[finishPoint.x][finishPoint.y] = new Finish();
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

	getObjectAt(coords: Coordinates): IObject | null {
		const { x, y } = coords
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return null
		}
		return this.objects[y][x]
	}

	setObjectAt(coords : Coordinates, object : IObject) : void {
		const { x, y } = coords
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return;
		}
		this.objects[y][x] = object;
	}

	public addWallOutline(): this {
		let wall = new Wall();
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (i === 0 || i === this.height - 1 || j === 0 || j === this.width - 1) {
					this.objects[i][j] = wall
				}
			}
		}
		return this
	}

	public clone(): Map {
		let map = new Map(this.height, this.width, this.spawnPoint, this.finishPoint);

		for (let i = 0; i < this.height; i++) {
			map.objects[i] = new Array(this.height);
			for (let j = 0; j < this.width; j++) {
				map.objects[i][j] = this.objects[i][j];
			}
		}

		return map;
	}
}
