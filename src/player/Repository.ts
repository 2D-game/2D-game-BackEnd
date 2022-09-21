import { Player } from './Player'
import { PlayerIndex as LobbyIndex } from '../lobby'
import { PlayerIndex as SessionIndex } from '../session'
import * as crypto from 'crypto'

const ErrPlayerAlreadyExists = 'Player already exists'
const ErrPlayerNotFound = 'Player not found'

export class Repository {
	private readonly players: Map<string, Player>
	private readonly lobbyIndex: LobbyIndex
	private readonly sessionIndex: SessionIndex

	constructor(lobbyIndex: LobbyIndex, sessionIndex: SessionIndex) {
		this.players = new Map()
		this.lobbyIndex = lobbyIndex
		this.sessionIndex = sessionIndex
	}

	insert(player: Player) {
		const id = crypto.randomUUID()
		player.setID(id)

		if (this.players.has(id)) {
			throw new Error(ErrPlayerAlreadyExists)
		}
		this.sessionIndex.insertPlayer(player)
		this.lobbyIndex.insertLobbyPlayer(player)
		this.players.set(id, player)
	}

	delete(id: string) {
		const p = this.players.get(id)
		if (p === undefined) {
			throw new Error(ErrPlayerNotFound)
		}
		this.sessionIndex.deletePlayer(p)
		this.lobbyIndex.deleteLobbyPlayer(p)
		this.players.delete(id)
	}
}
