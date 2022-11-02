import { Lobby } from '../lobby'
import { Game } from '../game'
import * as crypto from 'crypto'
import { Coordinates } from '../map'
import { ICommand } from './command/ICommand'

const ErrPlayerIsNotSpawned = 'Player is not spawned yet'

export class Player {
	private readonly id: string
	private readonly username: string
	private lobby: Lobby | null
	private game: Game | null
	private ready: boolean
	private coords: Coordinates | null
	private level: number
	private won: boolean

	constructor(username: string, lobby: Lobby | null = null) {
		this.id = crypto.randomUUID()
		this.username = username
		this.lobby = lobby
		this.game = null
		this.ready = false
		this.coords = null
		this.level = 0
		this.won = false
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

	isReady(): boolean {
		return this.ready
	}

	setReady(): Player {
		this.ready = true
		return this
	}

	getCoords(): Coordinates {
		if (this.coords === null) {
			throw new Error(ErrPlayerIsNotSpawned)
		}
		return this.coords
	}

	setCoords(coords: Coordinates): Player {
		this.coords = coords
		return this
	}

	getLevel(): number {
		return this.level
	}

	setLevel(level: number): Player {
		this.level = level
		return this
	}

	setWon(): Player {
		this.won = true
		return this
	}

	hasWon(): boolean {
		return this.won
	}

	incrementLevel() {
		this.level++
	}
}
