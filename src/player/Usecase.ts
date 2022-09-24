import { Player, Event, EventBus, Presenter } from './'
import * as dto from './'
import { Session } from '../session'
import { Lobby } from '../lobby'
import { Sessions } from '../session'

const ErrPlayerNotInGame = 'Player not in game'

export class Usecase {
	private readonly sessions: Sessions
	private readonly evBus: EventBus

	constructor(sessions: Sessions, evBus: EventBus) {
		this.sessions = sessions
		this.evBus = evBus
	}

	create(username: string, lobby: Lobby): Session {
		const player = new Player(username, lobby)

		const session = new Session(player)
		this.sessions.add(session)

		this.evBus.publish(Event.PLAYER_CREATED, player)
		return session
	}

	move(player: Player, req: dto.MoveReq): dto.MoveRes {
		dto.MoveReq.parse(req)

		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrPlayerNotInGame)
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

		return Presenter.getMoveRes(player)
	}

	disconnect(session: Session) {
		this.sessions.delete(session.getID())
		this.evBus.publish(Event.PLAYER_DISCONNECTED, session.getPlayer())
	}
}
