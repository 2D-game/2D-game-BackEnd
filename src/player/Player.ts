import { Lobby } from '../lobby'
import { Game } from '../game'
import * as crypto from 'crypto'

export class Player {
	protected id: string
	protected readonly username: string
	protected lobby: Lobby | null
	protected game: Game | null

	constructor(username: string, lobby: Lobby | null = null) {
		this.id = crypto.randomUUID()
		this.username = username
		this.lobby = lobby
		this.game = null
	}

	getID(): string {
		return this.id
	}

	getUsername(): string {
		return this.username
	}

	getLobby(): Lobby | null {
		return this.lobby
	}

	setLobby(lobby: Lobby | null): Player {
		this.lobby = lobby
		return this
	}

	getGame(): Game | null {
		return this.game
	}

	setGame(game: Game | null): Player {
		this.game = game
		return this
	}
}
