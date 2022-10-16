import { Player, Event, Publisher, Presenter } from './'
import * as dto from './'
import { Session } from '../session'
import { Lobby } from '../lobby'
import { Sessions } from '../session'
import { Type } from '../object'

const ErrNotInGame = 'Not in game'
const ErrNotInLobby = 'Not in lobby'
const ErrAlreadyInGame = 'Already in game'

export class Usecase {
	private readonly sessions: Sessions
	private readonly pub: Publisher

	constructor(sessions: Sessions, pub: Publisher) {
		this.sessions = sessions
		this.pub = pub
	}

	create(username: string, lobby: Lobby): Session {
		const player = new Player(username, lobby)

		const session = new Session(player)
		this.sessions.add(session)

		this.pub.publish(Event.PLAYER_CREATED, player)
		return session
	}

	move(player: Player, req: dto.MoveReq): dto.MoveRes {
		dto.MoveReq.parse(req)

		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		}

		let { x, y } = player.getCoords()

		switch (req.direction) {
			case dto.Direction.UP:
				y--
				break
			case dto.Direction.DOWN:
				y++
				break
			case dto.Direction.LEFT:
				x--
				break
			case dto.Direction.RIGHT:
				x++
				break
		}
		const newCoords = { x, y }

		const obj = game.getMap().getObjectAt(newCoords)
		if (obj !== null && !obj.isSolid()) {
			player.setCoords(newCoords)
		}

		if (obj !== null && (obj.getType() === Type.WATER || obj.getType() === Type.LAVA)) {
			player.setCoords(game.getMap().getSpawnPoint());
		}

		return Presenter.getMoveRes(player)
	}

	setReady(player: Player): dto.SetReadyRes {
		if (player.getLobby() === null) {
			throw new Error(ErrNotInLobby)
		} else if (player.getGame() !== null) {
			throw new Error(ErrAlreadyInGame)
		}
		player.setReady()
		this.pub.publish(Event.PLAYER_READY, player)
		return { id: player.getID() }
	}

	disconnect(session: Session) {
		this.sessions.delete(session.getID())
		this.pub.publish(Event.PLAYER_DISCONNECTED, session.getPlayer())
	}
}
