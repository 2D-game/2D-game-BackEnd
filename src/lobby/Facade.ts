import { Lobbies } from './Lobbies'
import { Game } from '../game'
import { Lobby } from './Lobby'
import { Image, PlayerColor } from '../player/image'
import { IUsecase } from '../player/image'

const exampleImg = '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'

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
		return await Promise.all(usedColors.map(color => this.imageUcase.getImage(color))).catch(() => {
			return usedColors.map((color) => new Image(color, exampleImg))
		})
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
