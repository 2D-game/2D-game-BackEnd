import { Socket } from 'socket.io'
import { Lobby } from './lobby'

export class Player {
	private readonly socket: Socket
	private username: string
	private lobby: Lobby | null

	constructor(socket: Socket) {
		this.socket = socket
		this.username = ''
		this.lobby = null
	}

	on(event: string, listener: (event: string, ...args: any[]) => void) {
		this.socket.on(event, (...args: any[]) => {
			listener(event, ...args)
		})
	}

	emit(event: string, ...args: any[]) {
		this.socket.emit(event, ...args)
	}

	getSocket(): Socket {
		return this.socket
	}

	getLobby(): Lobby | null {
		return this.lobby
	}

	getUsername(): string {
		return this.username
	}

	setUsername(name: string) {
		this.username = name
	}

	setLobby(lobby: Lobby | null) {
		this.lobby = lobby
	}
}
