import { Map } from '../map'
import { Player } from '../player'

export class Game {
	private readonly players: Set<Player>
	private readonly map: Map

	constructor(map: Map) {
		this.players = new Set()
		this.map = map
	}

	addPlayer(player: Player) {
		this.players.add(player)
	}

	deletePlayer(player: Player) {
		this.players.delete(player)
	}

	getMap(): Map {
		return this.map
	}
}
