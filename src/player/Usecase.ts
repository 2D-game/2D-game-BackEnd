import * as dto from './'
import { Direction, Event, Facade, Player, Presenter, Publisher } from './'
import { Session, Sessions } from '../session'
import { Lobby } from '../lobby'
import { Type } from '../object'

const ErrNotInGame = 'Not in game'
const ErrNotInLobby = 'Not in lobby'
const ErrAlreadyInGame = 'Already in game'
const ErrAlreadyWon = 'Already won'

export class Usecase {
	private readonly sessions: Sessions
	private readonly pub: Publisher
	private readonly facade: Facade

	constructor(sessions: Sessions, pub: Publisher, facade: Facade) {
		this.sessions = sessions
		this.pub = pub
		this.facade = facade
	}

	create(username: string, lobby: Lobby): Session {
		const player = new Player(username, lobby)

		const session = new Session(player)
		this.sessions.add(session)

		this.pub.publish(Event.PLAYER_CREATED, player)
		return session
	}

	move(player: Player, direction: Direction): dto.MoveRes {

		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		} else if (player.hasWon()) {
			throw new Error(ErrAlreadyWon)
		}

		let { x, y } = player.getCoords()

		switch (direction) {
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

		const obj = game.getMap(player.getLevel()).getObjectAt(newCoords)

		if (obj !== null) {
			if (obj.getType() == Type.FINISH) {
				return this.facade.nextLevel(player)
			} else if (!obj.isSolid()) {
				player.setCoords(newCoords)
				obj.collect(player)
			} else if (obj.getType() === Type.WATER || obj.getType() === Type.LAVA) {
				player.die()
			}
		}

		return Presenter.getMoveRes(player)
	}

	forceNextLevel(player: Player): dto.MoveRes {
		return this.facade.nextLevel(player)
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
