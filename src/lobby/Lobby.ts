import * as random from '../util/random'
import { Player } from '../player'

export class Lobby {
	private readonly id: string
	private readonly players: Set<Player>

	constructor() {
		this.id = random.digits(4)
		this.players = new Set()
	}

	getID(): string {
		return this.id
	}

	addPlayer(player: Player): void {
		this.players.add(player)
	}

	getPlayers(): Set<Player> {
		return this.players
	}

	playerCount(): number {
		return this.players.size
	}

	deletePlayer(player: Player): void {
		this.players.delete(player)
	}

	allPlayersReady(): boolean {
		return [...this.players].every(player => player.isReady())
	}
}

