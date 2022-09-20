import { Socket } from 'socket.io'
import { PlayerHandler } from './player_handler'
import { Player } from './Player'

export class Lobby implements PlayerHandler {
	private readonly id: string
	private players: Map<Socket, Player>

	constructor() {
		this.id = Lobby.randomID()
		this.players = new Map()
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

	onConnect(player: Player) {
		this.players.set(player.getSocket(), player)
		player.setLobby(this)
	}

	onDisconnect(player: Player) {

	}

	isEmpty(): boolean {
		return true
	}
}
