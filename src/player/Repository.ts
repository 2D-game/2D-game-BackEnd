import { Player } from './Player'
import { PlayerIndex as LobbyIndex } from '../lobby'
import { PlayerIndex as SessionIndex } from '../session'

export class Repository {
	private readonly players: Set<Player>
	private readonly lobbyIndex: LobbyIndex
	private readonly sessionIndex: SessionIndex

	constructor(lobbyIndex: LobbyIndex, sessionIndex: SessionIndex) {
		this.players = new Set()
		this.lobbyIndex = lobbyIndex
		this.sessionIndex = sessionIndex
	}

	insert(player: Player) {
		this.sessionIndex.insertPlayer(player)
		this.lobbyIndex.insertLobbyPlayer(player)
		this.players.add(player)
	}

	delete(player: Player) {
		this.sessionIndex.deletePlayer(player)
		this.lobbyIndex.deleteLobbyPlayer(player)
		this.players.delete(player)
	}
}
