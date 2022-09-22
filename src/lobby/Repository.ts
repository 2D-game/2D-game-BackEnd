import { Lobby } from './Lobby'
import { Player } from '../player'
import * as random from '../util/random'
import { IIndex } from '../repository'

const ErrLobbyNotFound = 'Lobby not found'
const ErrLobbyNotEmpty = 'Lobby not empty'
const ErrLobbyAlreadyExists = 'Lobby already exists'
const ErrLobbyPlayerNotFound = 'Lobby player not found'
const ErrLobbyPlayerAlreadyExists = 'Lobby player already exists'
const ErrPlayerIsNotInLobby = 'Player is not in game'

class PlayerIndexAdapter implements IIndex<Player>{
	private readonly index: Index

	constructor(index: Index) {
		this.index = index
	}

	insert(player: Player) {
		if (player.getLobby() === null) {
			return
		}
		this.index.insertLobbyPlayer(player)
	}

	delete(player: Player) {
		if (player.getLobby() === null) {
			return
		}
		this.index.deleteLobbyPlayer(player)
	}

	update(oldPlayer: Player, newPlayer: Player) {
		this.delete(oldPlayer)
		this.insert(newPlayer)
	}
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
		if (lobby === null) {
			throw new Error(ErrPlayerIsNotInLobby)
		}

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
		if (lobby === null) {
			throw new Error(ErrPlayerIsNotInLobby)
		}

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
	private readonly lobbies: Map<string, Lobby>
	private readonly index: Index

	constructor() {
		this.lobbies = new Map()
		this.index = new Index()
	}

	getPlayerIndex(): PlayerIndexAdapter {
		return new PlayerIndexAdapter(this.index)
	}

	insert(lobby: Lobby) {
		const id = random.digits(4)
		lobby.setID(id)

		if (this.lobbies.has(id)) {
			throw new Error(ErrLobbyAlreadyExists)
		}
		this.index.insertLobby(lobby)
		this.lobbies.set(id, lobby)
	}

	get(id: string): Lobby {
		const l = this.lobbies.get(id)
		if (l === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		return l
	}

	delete(id: string) {
		const l = this.get(id)
		if (l === undefined) {
			throw new Error(ErrLobbyNotFound)
		}
		this.index.deleteLobby(l)
		this.lobbies.delete(id)
	}

	playersCount(id: string): number {
		const l = this.get(id)
		return this.index.playersCount(l)
	}

	getPlayers(id: string): Set<Player> {
		const l = this.get(id)
		return this.index.getPlayers(l)
	}
}
