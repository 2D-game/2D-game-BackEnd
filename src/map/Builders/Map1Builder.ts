import { Lava } from '../../object/Lava'
import { Wall } from '../../object/wall/Wall'
import { Water } from '../../object/Water'
import { Map } from '../Map'
import { IBuilder } from './IBuilder'
import { Apple } from '../../object/item/Apple'
import { Game } from '../../game'
import { Publisher as MapPublisher } from '../Publisher'
import { Pear } from '../../object/item/Pear'
import { Portal } from '../../object/item/Portal'
import { Publisher as PlayerPublisher } from '../../player'
import { Box } from '../../object/item/Box'
import { GiftBox } from '../../object/item/GiftBox'
import { BadApple } from '../../object/item/BadApple'


export class Map1Builder implements IBuilder {
	private map: Map

	constructor(map: Map) {
		this.map = map.clone()
	}

	addWalls(): IBuilder {
		let wall = new Wall()
		for (let i = 1; i < this.map.getHeight() - 2; i++)
			this.map.setObjectAt({ x: 2, y: i }, wall)

		for (let i = 2; i < this.map.getHeight() - 1; i++)
			this.map.setObjectAt({ x: 4, y: i }, wall)

		for (let i = 11; i < 17; i++)
			for (let j = 3; j < 7; j++)
				this.map.setObjectAt({ x: i, y: j }, wall)

		return this
	}

	addLava(): IBuilder {
		let lava = new Lava()
		this.map.setObjectAt({ x: 5, y: 2 }, lava)
		this.map.setObjectAt({ x: 6, y: 2 }, lava)

		if (Math.random() < 0.5) {
			this.map.setObjectAt({ x: 12, y: 1 }, lava)
		}

		if (Math.random() < 0.5) {
			this.map.setObjectAt({ x: 12, y: 2 }, lava)
		}

		if (Math.random() < 0.5) {
			this.map.setObjectAt({ x: 13, y: 1 }, lava)
		}

		if (Math.random() < 0.5) {
			this.map.setObjectAt({ x: 13, y: 2 }, lava)
		}

		return this
	}

	addWater(): IBuilder {
		let water = new Water()
		for (let i = 1; i < 6; i++)
			this.map.setObjectAt({ x: 8, y: i }, water)

		return this
	}

	addItems(game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher): IBuilder {
		const portalCoords = { x: 5, y: 8 }
		this.map.setObjectAt(
			portalCoords,
			new Portal(game, level, portalCoords, mapPub, playerPub, { x: 17, y: 2 })
		)

		for (let i = 0; i < 3; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Apple(game, level, coords, mapPub, playerPub))
		}
		for (let i = 0; i < 1; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Pear(game, level, coords, mapPub, playerPub))
		}

		for (let i = 0; i < 2; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new Box(game, level, coords, mapPub, playerPub))
		}

		for (let i = 0; i < 1; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new GiftBox(game, level, coords, mapPub, playerPub))
		}

		for (let i = 0; i < 1; i++) {
			const coords = this.map.getRandomEmptyCoords()
			this.map.setObjectAt(coords, new BadApple(game, level, coords, mapPub, playerPub))
		}
		return this
	}

	build(): Map {
		return this.map
	}

}
