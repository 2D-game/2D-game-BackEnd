import { Game, Presenter, Event as GameEvent, EventBus as GameEventBus } from './'
import { Event as PlayerEvent, EventBus as PlayerEventBus, Player } from '../player'
import * as dto from './dto'
import { Lobby } from '../lobby'
import { Map } from '../map'
import { Lobbies } from '../lobby'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly gameEvBus: GameEventBus

	constructor(lobbies: Lobbies, gameEvBus: GameEventBus, playerEvBus: PlayerEventBus) {
		this.lobbies = lobbies
		this.gameEvBus = gameEvBus

		playerEvBus.subscribe(PlayerEvent.PLAYER_DISCONNECTED, this.onPlayerDisconnect.bind(this))
	}

	start(lobby: Lobby): dto.StartRes {
		const game = new Game(
			lobby.getID(),
			new Map(10, 10, { x: 1, y: 1 })
				.addWallOutline()
		)

		lobby.getPlayers().forEach(player => {
			player.setLobby(null).setGame(game)
			lobby.deletePlayer(player)
			game.addPlayer(player)
		})
		this.lobbies.delete(lobby.getID())
		this.gameEvBus.publish(GameEvent.PLAYER_LIST_CHANGE, game)

		return Presenter.getStartRes(game)
	}

	getPlayers(game: Game): dto.GetPlayersRes {
		return Presenter.getPlayerRes(game.getPlayers())
	}

	onPlayerDisconnect(player: Player) {
		const game = player.getGame()
		if (game === null) {
			return
		}
		game.deletePlayer(player)

		this.gameEvBus.publish(GameEvent.PLAYER_LIST_CHANGE, game)
	}
}
