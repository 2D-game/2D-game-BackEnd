import { Lobby } from '../lobby'
import { Game } from '../game'

export class Player {
	protected id: string | null
	protected readonly username: string
	protected lobby: Lobby | null
	protected game: Game | null

	constructor(username: string, lobby: Lobby | null = null) {
		this.id = null
		this.username = username
		this.lobby = lobby
		this.game = null
	}

	protected getInstance(): Player {
		return this
	}

	updateBuilder(): PlayerUpdate {
		return new PlayerUpdate(this.username, this.lobby)
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

	getLobby(): Lobby | null {
		return this.lobby
	}

	getGame(): Game | null {
		return this.game
	}
}

export class PlayerUpdate extends Player {
	constructor(username: string, lobby: Lobby | null) {
		super(username, lobby)
	}

	setLobby(lobby: Lobby | null) {
		this.lobby = lobby
	}

	setGame(game: Game | null) {
		this.game = game
	}

	build(): Player {
		return super.getInstance()
	}
}
