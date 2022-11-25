import { Item } from './Item'
import { Player } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher } from '../../map'

export class Pear extends Item {
	constructor(game: Game, level: number, coords: Coordinates, pub: Publisher) {
		super(game, level, coords, pub)
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
