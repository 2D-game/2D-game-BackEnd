import { Player, Event, EventBus } from '../player'
import { Session } from '../session'
import { Lobby } from '../lobby'
import { Sessions } from '../session'

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

	disconnect(session: Session) {
		this.sessions.delete(session.getID())
		this.evBus.publish(Event.PLAYER_DISCONNECTED, session.getPlayer())
	}
}
