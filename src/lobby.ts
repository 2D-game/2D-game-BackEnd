import { PlayerHandler } from './player_handler'
import { Player } from './Player'
import { newRes } from './response'

type PlayerList = {
	names: string[]
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

	getNames(): string[] {
		return Array.from(this.players).map((p) => p.getName())
	}

	onConnect(player: Player, name: string) {
		player.setName(name)
		player.setLobby(this)
		this.players.add(player)

		const names = this.getNames()
		this.players.forEach((p) => {
			p.emit('player_list', newRes<PlayerList>({
				names: names
			}))
		})

		player.on('player_list', (ev) => this.onPlayerList(ev, player))
	}

	onPlayerList(ev: string, player: Player) {
		const names = this.getNames()
		player.emit(ev, newRes<PlayerList>({
			names: names
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
