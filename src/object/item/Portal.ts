import { Item } from './Item'
import { Player } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher } from '../../map'

export class Portal extends Item {
	private readonly teleportCoords: Coordinates

	constructor(game: Game, level: number, coords: Coordinates, pub: Publisher, teleportCoords: Coordinates) {
		super(game, level, coords, pub)
		this.teleportCoords = teleportCoords
	}

	public getType() {
		return Type.PORTAL
	}

	public changeScore(player: Player): boolean {
		if (player.getScore() < 10) {
			return false
		}
		player.deductScore(10)
		return true
	}

	public deleteCurrentItem(): boolean {
		return false
	}

	public spawnNewItem(): boolean {
		return false
	}

	public teleportPlayer(player: Player): boolean {
		player.setCoords(this.teleportCoords)
		return true
	}
}
