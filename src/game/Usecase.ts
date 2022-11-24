import { Levels } from '../level/Level'
import { Event, Game, Presenter, Publisher } from './'
import { Player } from '../player'
import * as dto from './dto'
import { Lobbies, Lobby } from '../lobby'
import { Director } from '../map/Builders/Director'
import { Facade as LobbyFacade } from '../lobby/Facade'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly pub: Publisher
	private readonly lobbyFacade: LobbyFacade

	constructor(lobbies: Lobbies, pub: Publisher, lobbyFacade: LobbyFacade) {
		this.lobbies = lobbies
		this.pub = pub
		this.lobbyFacade = lobbyFacade
	}

	start(lobby: Lobby): [boolean, dto.StartRes | null] {
		if (lobby.getPlayers().size < 1 || !lobby.allPlayersReady()) {
			return [false, null]
		}

		const firstMap = Director.CreateMap1(
			Levels[0].createMap().getInitialData()
		)
		const secondMap = Director.CreateMap2(
			Levels[1].createMap().getInitialData()
		)
		const thirdMap = Director.CreateMap3(
			Levels[2].createMap().getInitialData()
		)
		const maps = [firstMap, secondMap, thirdMap]
		const game = new Game(lobby.getID(), maps)

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
