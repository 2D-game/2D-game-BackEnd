import { Lobbies } from './Lobbies'
import { Game } from '../game'
import { Lobby } from './Lobby'
import { Image, PlayerColor } from '../player/image'
import { IUsecase } from '../player/image'

export class Facade {
	private readonly lobbies: Lobbies
	private readonly imageUcase: IUsecase

	constructor(lobbies: Lobbies, imageUcase: IUsecase) {
		this.lobbies = lobbies
		this.imageUcase = imageUcase
	}

	public async getImages(lobby: Lobby): Promise<Image[]> {
		const usedColors: PlayerColor[] = []
		const size = lobby.getPlayers().size
		for (let i = 0; i < size; i++) {
			usedColors.push(this.imageUcase.getUnusedColor(usedColors))
		}
		return await Promise.all(usedColors.map(color => this.imageUcase.getImage(color)))
	}

	public async movePlayersToGame(lobby: Lobby, game: Game) {
		const images = await this.getImages(lobby)

		let i = 0
		lobby.getPlayers().forEach((player) => {
			const spawnPoint = game.getMap(0).getSpawnPoint()
			player
				.setLobby(null)
				.setGame(game)
				.setCoords(spawnPoint)
				.setImage(images[i])
			lobby.deletePlayer(player)
			game.addPlayer(player)
			i++
		})
		this.lobbies.delete(lobby.getID())
	}
}
