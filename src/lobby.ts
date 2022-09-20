import { PlayerHandler } from './player_handler'
import { Player } from './Player'
import { newRes } from './response'

type PlayerList = {
	usernames: string[]
}

export class Lobby implements PlayerHandler {
	private readonly id: string
	private players: Set<Player>

	constructor() {
		this.id = Lobby.randomID()
		this.players = new Set()
	}

	private static randomID(): string {
		const chars = '0123456789'
		let id = ''
		for (let i = 0; i < 4; i++) {
			id += chars[Math.floor(Math.random() * chars.length)]
		}
		return id
	}

	getID(): string {
		return this.id
	}

	getUsernames(): string[] {
		return Array.from(this.players).map((p) => p.getUsername())
	}

	onConnect(player: Player, name: string) {
		player.setUsername(name)
		player.setLobby(this)
		this.players.add(player)

		const usernames = this.getUsernames()
		this.players.forEach((p) => {
			p.emit('player_list', newRes<PlayerList>({
				usernames: usernames
			}))
		})

		player.on('player_list', (ev) => this.onPlayerList(ev, player))
	}

	onPlayerList(ev: string, player: Player) {
		const usernames = this.getUsernames()
		player.emit(ev, newRes<PlayerList>({
			usernames: usernames
		}))
	}

	onDisconnect(player: Player) {
		this.players.delete(player)
		player.setLobby(null)
	}

	isEmpty(): boolean {
		return this.players.size === 0
	}
}
