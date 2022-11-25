import { Item } from './Item'
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher as MapPublisher } from '../../map'

export class Pear extends Item {
	constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		super(game, level, coords, mapPub, playerPub)
	}

	public getType() {
		return Type.PEAR
	}

	public changeScore(player: Player): boolean {
		player.addScore(5)
		return true
	}

	public spawnNewItem(): boolean {
		return false
	}
}
