import { Game, Presenter, Event, Publisher } from './'
import { Player } from '../player'
import * as dto from './dto'
import { Lobby } from '../lobby'
import { Map } from '../map'
import { Lobbies } from '../lobby'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly pub: Publisher

	constructor(lobbies: Lobbies, pub: Publisher) {
		this.lobbies = lobbies
		this.pub = pub
	}

	start(lobby: Lobby): [boolean, dto.StartRes | null] {
		if (lobby.getPlayers().size < 2 || !lobby.allPlayersReady()) {
			return [false, null]
		}

		const spawnPoint = { x: 1, y: 1 }
		const game = new Game(
			lobby.getID(),
			new Map(10, 20, spawnPoint)
				.addWallOutline()
		)

		lobby.getPlayers().forEach(player => {
			player
				.setLobby(null)
				.setGame(game)
				.setCoords(spawnPoint)
			lobby.deletePlayer(player)
			game.addPlayer(player)
		})
		this.lobbies.delete(lobby.getID())
		this.pub.publish(Event.PLAYER_LIST_CHANGE, game)

		return [true, Presenter.getStartRes(game)]
	}

	getPlayers(game: Game): dto.GetPlayersRes {
		return Presenter.getPlayersRes(game.getPlayers())
	}

	deletePlayer(player: Player) {
		const game = player.getGame()
		if (game === null) {
			return
		}
		game.deletePlayer(player)

		this.pub.publish(Event.PLAYER_LIST_CHANGE, game)
	}
}
