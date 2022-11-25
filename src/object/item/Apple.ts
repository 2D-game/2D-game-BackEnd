import { Item } from './Item'
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher as MapPublisher } from '../../map'

export class Apple extends Item {
	constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		super(game, level, coords, mapPub, playerPub)
	}

	public getType() {
		return Type.APPLE
	}

	public changeScore(player: Player): boolean {
		player.addScore(1)
		return true
	}

	public spawnNewItem(): boolean {
		const map = this.game.getMap(this.level)
		const coords = map.getRandomEmptyCoords()
		map.setObjectAt(coords, new Apple(this.game, this.level, coords, this.mapPub, this.playerPub))
		return true
	}
}
