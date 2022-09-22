import { Game, Presenter, Repository as GameRepository } from './'
import * as dto from './dto'
import { Repository as LobbyRepository } from '../lobby'
import { Repository as PlayerRepository } from '../player'
import { Lobby } from '../lobby'
import { Map } from '../map'

export class Usecase {
	private readonly gameRepo: GameRepository
	private readonly lobbyRepo: LobbyRepository
	private readonly playerRepo: PlayerRepository

	constructor(gameRepo: GameRepository, lobbyRepo: LobbyRepository, playerRepo: PlayerRepository) {
		this.gameRepo = gameRepo
		this.lobbyRepo = lobbyRepo
		this.playerRepo = playerRepo
	}

	start(lobby: Lobby): dto.StartRes {
		const game = new Game(new Map(10, 10, { x: 1, y: 1 }))
		this.gameRepo.insert(game)

		this.lobbyRepo.getPlayers(lobby.getID()).forEach((player) => {
			const newPlayer = player
				.updateBuilder()
				.setLobby(null)
				.setGame(game)
				.build()
			this.playerRepo.update(player.getID(), newPlayer)
		})

		return Presenter.getStartRes(game)
	}
}
