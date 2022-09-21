import { Lobby } from './Lobby'
import { Player } from '../player'
import * as random from '../util/random'

const ErrLobbyNotFound = 'Lobby not found'
const ErrLobbyNotEmpty = 'Lobby not empty'
const ErrLobbyAlreadyExists = 'Lobby already exists'
const ErrLobbyPlayerNotFound = 'Lobby player not found'
const ErrLobbyPlayerAlreadyExists = 'Lobby player already exists'

export interface PlayerIndex {
	insertLobbyPlayer(player: Player): void
	deleteLobbyPlayer(player: Player): void
}

class Index {
	private readonly lobbyPlayers: Map<Lobby, Set<Player>>

	constructor() {
		this.lobbyPlayers = new Map()
	}

	playersCount(looby: Lobby): number {
		const p = this.lobbyPlayers.get(looby)
		if (p === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		return p.size
	}

	getPlayers(lobby: Lobby): Set<Player> {
		const p = this.lobbyPlayers.get(lobby)
		if (p === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		return p
	}

	insertLobby(lobby: Lobby) {
		if (this.lobbyPlayers.has(lobby)) {
			throw new Error(ErrLobbyAlreadyExists)
		}
		this.lobbyPlayers.set(lobby, new Set())
	}

	deleteLobby(lobby: Lobby) {
		const p = this.lobbyPlayers.get(lobby)
		if (p === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		if (p.size > 0) {
			throw new Error(ErrLobbyNotEmpty)
		}
		this.lobbyPlayers.delete(lobby)
	}

	insertLobbyPlayer(player: Player) {
		const lobby = player.getLobby()
		const p = this.lobbyPlayers.get(lobby)
		if (p === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		if (p.has(player)) {
			throw new Error(ErrLobbyPlayerAlreadyExists)
		}
		p.add(player)
	}

	deleteLobbyPlayer(player: Player) {
		const lobby = player.getLobby()
		const p = this.lobbyPlayers.get(lobby)
		if (p === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		if (!p.delete(player)) {
			throw new Error(ErrLobbyPlayerNotFound)
		}
	}
}

export class Repository {
	private readonly lobbies: Set<Lobby>
	private readonly index: Index

	constructor() {
		this.lobbies = new Set()
		this.index = new Index()
	}

	getIndex(): PlayerIndex {
		return this.index
	}

	insert(lobby: Lobby) {
		lobby.setID(random.digits(4))
		this.index.insertLobby(lobby)
		if (this.lobbies.has(lobby)) {
			throw new Error(ErrLobbyAlreadyExists)
		}
		this.lobbies.add(lobby)
	}

	delete(lobby: Lobby) {
		this.index.deleteLobby(lobby)
		if (!this.lobbies.delete(lobby)) {
			throw new Error(ErrLobbyNotFound)
		}
	}

	playersCount(lobby: Lobby): number {
		return this.index.playersCount(lobby)
	}

	getPlayers(lobby: Lobby): Set<Player> {
		return this.index.getPlayers(lobby)
	}
}
