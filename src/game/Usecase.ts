import { Levels } from '../level/Level'
import { Event, Game, Presenter, Publisher } from './'
import { Player } from '../player'
import * as dto from './dto'
import { Lobbies, Lobby } from '../lobby'
import { Facade as LobbyFacade } from '../lobby/Facade'
import { Publisher as MapPublisher } from '../map/Publisher'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly pub: Publisher
	private readonly mapPub: MapPublisher
	private readonly lobbyFacade: LobbyFacade

	constructor(lobbies: Lobbies, pub: Publisher, mapPub: MapPublisher, lobbyFacade: LobbyFacade) {
		this.lobbies = lobbies
		this.pub = pub
		this.mapPub = mapPub
		this.lobbyFacade = lobbyFacade
	}

	start(lobby: Lobby): [boolean, dto.StartRes | null] {
		if (lobby.getPlayers().size < 1 || !lobby.allPlayersReady()) {
			return [false, null]
		}

		const game = new Game(lobby.getID(), this.mapPub)

		this.lobbyFacade.movePlayersToGame(lobby, game)
		this.pub.publish(Event.PLAYER_LIST_CHANGE, game)

		return [true, Presenter.getStartRes(game, Levels[0])]
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
