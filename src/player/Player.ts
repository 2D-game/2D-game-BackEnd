import { Lobby } from '../lobby'

export class Player {
	private id: string | null
	private readonly username: string
	private readonly lobby: Lobby

	constructor(username: string, lobby: Lobby) {
		this.id = null
		this.username = username
		this.lobby = lobby
	}

	setID(id: string) {
		this.id = id
	}

	getID(): string {
		if (this.id === null) {
			throw new Error('Player ID is not set')
		}
		return this.id
	}

	getUsername(): string {
		return this.username
	}

	getLobby(): Lobby {
		return this.lobby
	}
}
