import { Lobbies } from './Lobbies'
import { Game } from '../game'
import { Lobby } from './Lobby'

export class Facade {
	private readonly lobbies: Lobbies

	constructor(lobbies: Lobbies) {
		this.lobbies = lobbies
	}

	public movePlayersToGame(lobby: Lobby, game: Game) {
		lobby.getPlayers().forEach((player) => {
			const spawnPoint = game.getMap(0).getSpawnPoint()
			player.setLobby(null).setGame(game).setCoords(spawnPoint)
			lobby.deletePlayer(player)
			game.addPlayer(player)
		})
		this.lobbies.delete(lobby.getID())
	}
}
