import { Lobby } from '../lobby'

export class Player {
	private readonly username: string
	private readonly lobby: Lobby

	constructor(username: string, lobby: Lobby) {
		this.username = username
		this.lobby = lobby
	}

	getUsername(): string {
		return this.username
	}

	getLobby(): Lobby {
		return this.lobby
	}
}
