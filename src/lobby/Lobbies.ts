import { Lobby } from './Lobby'

const ErrLobbyNotFound = 'Lobby not found'
const ErrLobbyAlreadyExists = 'Lobby already exists'

export class Lobbies {
	private readonly lobbies: Map<string, Lobby>

	constructor() {
		this.lobbies = new Map()
	}

	add(lobby: Lobby): void {
		if (this.lobbies.has(lobby.getID())) {
			throw new Error(ErrLobbyAlreadyExists)
		}
		this.lobbies.set(lobby.getID(), lobby)
	}

	get(id: string): Lobby {
		const l = this.lobbies.get(id)
		if (l === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		return l
	}

	delete(id: string): void {
		if (!this.lobbies.delete(id)) {
			throw new Error(ErrLobbyNotFound)
		}
	}
}
