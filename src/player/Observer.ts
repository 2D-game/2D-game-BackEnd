import { IObserver } from '../util/Observer'
import { Event as PlayerEv, Player, Publisher as PlayerPub, ScoreChange } from './'
import { Server as IOServer } from 'socket.io'
import { ExtendedSocket } from '../util/Socket'

export class Observer implements IObserver {
	private readonly playerPub: PlayerPub
	private readonly io: IOServer

	constructor(playerPub: PlayerPub, io: IOServer) {
		this.playerPub = playerPub
		this.io = io
	}

	start() {
		this.playerPub.subscribe(
			PlayerEv.PLAYER_SCORE_CHANGE,
			this.onPlayerScoreChange.bind(this)
		)
	}

	stop() {
		this.playerPub.unsubscribe(
			PlayerEv.PLAYER_SCORE_CHANGE,
			this.onPlayerScoreChange.bind(this)
		)
	}

	private onPlayerScoreChange(player: Player) {
		const game = player.getGame()
		if (!game) return

		const res = ExtendedSocket.response(<ScoreChange>{
			id: player.getID(),
			userName: player.getUsername(),
			score: player.getScore()
		})
		this.io.to(game.getID()).emit('player_score_change', res)
	}
}
