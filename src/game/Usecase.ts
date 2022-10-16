import { Game, Presenter, Event, Publisher } from './'
import { Direction, Player } from '../player'
import * as dto from './dto'
import { Lobby } from '../lobby'
import { Map } from '../map'
import { Lobbies } from '../lobby'
import { Director } from '../map/Builders/Director'

export class Usecase {
	private readonly lobbies: Lobbies
	private readonly pub: Publisher
	private readonly maps: Array<Map>

	constructor(lobbies: Lobbies, pub: Publisher) {
		this.lobbies = lobbies
		this.pub = pub
		this.maps = [new Map(10, 20, { x: 1, y: 1 })
				.addWallOutline(), new Map(20, 20, { x: 10, y: 10 })
				.addWallOutline()]
	}

	start(lobby: Lobby): [boolean, dto.StartRes | null] {
		if (lobby.getPlayers().size < 2 || !lobby.allPlayersReady()) {
			return [false, null]
		}

		const game = new Game(
			lobby.getID(),
			Director.CreateMap1(this.maps[0])
		)

		lobby.getPlayers().forEach(player => {
			player
				.setLobby(null)
				.setGame(game)
				.setCoords(this.maps[0].getSpawnPoint())
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
