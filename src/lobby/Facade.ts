import { Lobbies } from './Lobbies'
import { Game } from '../game'
import { Lobby } from './Lobby'
import { Usecase } from '../player/image'

export class Facade {
	private readonly lobbies: Lobbies
	private readonly imageUcase: Usecase

	constructor(lobbies: Lobbies, imageUcase: Usecase) {
		this.lobbies = lobbies
		this.imageUcase = imageUcase
	}

	public async movePlayersToGame(lobby: Lobby, game: Game) {
		const image = await this.imageUcase.downloadSVGImage()

		lobby.getPlayers().forEach((player) => {
			const spawnPoint = game.getMap(0).getSpawnPoint()
			player
				.setLobby(null)
				.setGame(game)
				.setCoords(spawnPoint)
				.setImage(image)
			lobby.deletePlayer(player)
			game.addPlayer(player)
		})
		this.lobbies.delete(lobby.getID())
	}
}
