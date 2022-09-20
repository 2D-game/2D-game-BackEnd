import { Socket } from 'socket.io'
import { Lobby } from './lobby'

export class Player {
	private readonly socket: Socket
	private name: string
	private lobby: Lobby | null

	constructor(socket: Socket) {
		this.socket = socket
		this.name = ''
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

	getName(): string {
		return this.name
	}

	setName(name: string) {
		this.name = name
	}

	setLobby(lobby: Lobby | null) {
		this.lobby = lobby
	}
}
