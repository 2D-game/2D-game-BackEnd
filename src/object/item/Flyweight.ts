import { Game } from '../../game'
import { Publisher as MapPublisher } from '../../map'
import { Publisher as PlayerPublisher } from '../../player'

export class Flyweight {
	private readonly game: Game
	private readonly level: number
	private readonly mapPub: MapPublisher
	private readonly playerPub: PlayerPublisher

	constructor(game: Game, level: number, mapPub: MapPublisher, playerPub: PlayerPublisher) {
		this.game = game
		this.level = level
		this.mapPub = mapPub
		this.playerPub = playerPub
	}

	public getGame(): Game {
		return this.game
	}

	public getLevel(): number {
		return this.level
	}

	public getMapPub(): MapPublisher {
		return this.mapPub
	}

	public getPlayerPub(): PlayerPublisher {
		return this.playerPub
	}
}
