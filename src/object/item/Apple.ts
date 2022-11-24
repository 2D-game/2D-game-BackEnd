import { Item } from './Item'
import { Player } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher } from '../../map'

export class Apple extends Item {
	constructor(game: Game, level: number, coords: Coordinates, pub: Publisher) {
		super(game, level, coords, pub)
	}

	public getType() {
		return Type.APPLE
	}

	public changeScore(player: Player) {
		player.addScore(1)
	}

	public spawnNewItem(): boolean {
		const map = this.game.getMap(this.level)
		const coords = map.getRandomEmptyCoords()
		map.setObjectAt(coords, new Apple(this.game, this.level, coords, this.pub))
		return true
	}
}
