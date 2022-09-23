import { Game, Presenter } from './'
import { Event as PlayerEvent, EventBus as PlayerEventBus, Player } from '../player'
import * as dto from './dto'
import { Lobby } from '../lobby'
import { Map } from '../map'

export class Usecase {

	constructor(playerEvBus: PlayerEventBus) {
		playerEvBus.subscribe(PlayerEvent.PLAYER_DISCONNECTED, this.onPlayerDisconnect.bind(this))
	}

	start(lobby: Lobby): dto.StartRes {
		const game = new Game(new Map(10, 10, { x: 1, y: 1 }))

		lobby.getPlayers().forEach(player => {
			player.setLobby(null).setGame(game)
			lobby.deletePlayer(player)
			game.addPlayer(player)
		})

		return Presenter.getStartRes(game)
	}

	onPlayerDisconnect(player: Player) {
		const game = player.getGame()
		if (game === null) {
			return
		}
		game.deletePlayer(player)
	}
}
