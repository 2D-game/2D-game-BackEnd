import { Item } from './Item'
import { Player, Publisher as PlayerPublisher } from '../../player'
import { Game } from '../../game'
import { Coordinates } from '../../map'
import { Type } from '../IObject'
import { Publisher as MapPublisher } from '../../map'

export class Portal extends Item {
	private readonly teleportCoords: Coordinates

	constructor(game: Game, level: number, coords: Coordinates, mapPub: MapPublisher, playerPub: PlayerPublisher, teleportCoords: Coordinates) {
		super(game, level, coords, mapPub, playerPub)
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
