import * as dto from './'
import { Event, Facade, Player, Presenter, Publisher } from './'
import { Session, Sessions } from '../session'
import { Lobby } from '../lobby'
import { Type } from '../object'
import { ICommand } from './command/ICommand'
import { MoveUpCommand } from './command/MoveUpCommand'
import { MoveDownCommand } from './command/MoveDownCommand'
import { MoveLeftCommand } from './command/MoveLeftCommand'
import { MoveRightCommand } from './command/MoveRightCommand'

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

	move(player: Player, req: dto.MoveReq): dto.MoveRes {
		dto.MoveReq.parse(req)

		const game = player.getGame()
		if (game === null) {
			throw new Error(ErrNotInGame)
		} else if (player.hasWon()) {
			throw new Error(ErrAlreadyWon)
		}

		let { x, y } = player.getCoords()

		let command = null

		switch (req.direction) {
			case dto.Direction.UP:
				y--
				command = new MoveUpCommand({x, y})
				break
			case dto.Direction.DOWN:
				y++
				command = new MoveDownCommand({x, y})
				break
			case dto.Direction.LEFT:
				x--
				command = new MoveLeftCommand({x, y})
				break
			case dto.Direction.RIGHT:
				x++
				command = new MoveRightCommand({x, y})
				break
			case dto.Direction.UNDO:
				let undoneCoords = player.undo()
				x = undoneCoords.x
				y = undoneCoords.y
				break
		}
		const newCoords = { x, y }

		const obj = game.getMap(player.getLevel()).getObjectAt(newCoords)

		if (obj !== null) {
			if (obj.getType() == Type.FINISH) {
				return this.facade.nextLevel(player)
			} else if (!obj.isSolid()) {
				if (command !== null)
					player.addCommand(command)
				player.setCoords(newCoords)
			} else if (obj.getType() === Type.WATER || obj.getType() === Type.LAVA) {
				if (command !== null)
					player.addCommand(command)
				player.setCoords(game.getMap(player.getLevel()).getSpawnPoint())
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
