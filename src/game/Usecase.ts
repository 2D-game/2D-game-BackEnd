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

	start(lobby: Lobby): [boolean, dto.StartRes | null] {
		if (lobby.getPlayers().size < 2 || !lobby.allPlayersReady()) {
			return [false, null]
		}

		const spawnPoint = { x: 1, y: 1 }
		const game = new Game(
			lobby.getID(),
			new Map(10, 10, spawnPoint)
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
		this.gameEvBus.publish(GameEvent.PLAYER_LIST_CHANGE, game)

		return [true, Presenter.getStartRes(game)]
	}

	getPlayers(game: Game): dto.GetPlayersRes {
		return Presenter.getPlayersRes(game.getPlayers())
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
